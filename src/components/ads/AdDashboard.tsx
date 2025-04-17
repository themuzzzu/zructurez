
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { RefreshCw, Plus, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AdPerformanceMetrics } from "./AdPerformanceMetrics";
import { AdCreateForm } from "./AdCreateForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Advertisement } from "@/types/advertisement";

export const AdDashboard = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: adCampaigns = [], refetch } = useQuery({
    queryKey: ["ad-campaigns"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to load ad campaigns",
          description: error.message,
        });
        return [];
      }

      return data as Advertisement[];
    },
  });

  const refreshData = async () => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
    toast({
      title: "Ad campaigns refreshed",
    });
  };

  const filterAdsByStatus = (status: string) => {
    return adCampaigns.filter((ad) => ad.status === status);
  };

  const activeAds = filterAdsByStatus("active");
  const pendingAds = filterAdsByStatus("pending");
  const expiredAds = filterAdsByStatus("expired");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeAds.length}</div>
            <p className="text-muted-foreground">Active Campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{pendingAds.length}</div>
            <p className="text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {adCampaigns.reduce((sum, ad) => sum + (ad.clicks || 0), 0)}
            </div>
            <p className="text-muted-foreground">Total Clicks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="active">
            Active
            {activeAds.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeAds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {pendingAds.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingAds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired
            {expiredAds.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {expiredAds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <AdCampaignsTable ads={activeAds} status="active" onRefresh={refreshData} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <AdCampaignsTable ads={pendingAds} status="pending" onRefresh={refreshData} />
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <AdCampaignsTable ads={expiredAds} status="expired" onRefresh={refreshData} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <AdPerformanceMetrics ads={adCampaigns} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AdCreateForm
            onSuccess={() => {
              setCreateDialogOpen(false);
              refreshData();
              toast({
                title: "Ad campaign created successfully",
                description: "Your ad is now pending review",
              });
            }}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// This is just a placeholder - you'll need to implement the actual table
const AdCampaignsTable = ({ ads, status, onRefresh }: { ads: Advertisement[], status: string, onRefresh: () => Promise<void> }) => {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Delete ad function
  const deleteAd = async (id: string) => {
    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Ad deleted successfully",
      });
      onRefresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete ad",
        description: error.message,
      });
    }
  };

  if (ads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground mb-2">No {status} ad campaigns found</p>
          {status === "active" && (
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Ad
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">End Date</th>
                <th className="p-3 text-left">Budget</th>
                <th className="p-3 text-left">Clicks</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">{ad.title}</td>
                  <td className="p-3">
                    <Badge variant="outline">{ad.type}</Badge>
                  </td>
                  <td className="p-3">{new Date(ad.start_date).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(ad.end_date).toLocaleDateString()}</td>
                  <td className="p-3">${ad.budget}</td>
                  <td className="p-3">{ad.clicks || 0}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        ad.status === "active"
                          ? "success"
                          : ad.status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {ad.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteAd(ad.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdDashboard;
