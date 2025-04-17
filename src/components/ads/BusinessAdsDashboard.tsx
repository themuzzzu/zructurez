
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdCampaign } from "@/services/adService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdCreateForm } from "./AdCreateForm";
import { RefreshCw, Plus, Zap, DollarSign, BarChart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BusinessAdsDashboardProps {
  businessId?: string;
}

export const BusinessAdsDashboard = ({ businessId }: BusinessAdsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("active");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const { data: adCampaigns = [], refetch } = useQuery({
    queryKey: ["business-ads", businessId],
    queryFn: async () => {
      if (!businessId) return [];

      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to load ad campaigns",
          description: error.message,
        });
        return [];
      }

      return data as AdCampaign[];
    },
    enabled: !!businessId,
  });

  const refreshData = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
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

  const totalClicks = adCampaigns.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const totalImpressions = adCampaigns.reduce((sum, ad) => sum + (ad.reach || 0), 0);
  const totalBudget = adCampaigns.reduce((sum, ad) => sum + (ad.budget || 0), 0);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Your Ad Campaigns</h3>
          <p className="text-sm text-muted-foreground">Manage and track your business advertisements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{activeAds.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{totalClicks}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">{totalImpressions}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget}</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
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
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <CampaignsTable ads={activeAds} onRefresh={refreshData} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <CampaignsTable ads={pendingAds} onRefresh={refreshData} />
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <CampaignsTable ads={expiredAds} onRefresh={refreshData} />
        </TabsContent>
      </Tabs>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AdCreateForm
            businessId={businessId}
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

interface CampaignsTableProps {
  ads: AdCampaign[];
  onRefresh: () => void;
}

const CampaignsTable = ({ ads, onRefresh }: CampaignsTableProps) => {
  const { toast } = useToast();
  
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete ad",
        description: error.message,
      });
    }
  };

  if (ads.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground text-center mb-4">No ads found in this category</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => document.querySelector('[data-create-ad-button="true"]')?.click()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create a new ad campaign
          </Button>
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
                <th className="p-3 text-left hidden md:table-cell">Start Date</th>
                <th className="p-3 text-left hidden md:table-cell">End Date</th>
                <th className="p-3 text-left">Budget</th>
                <th className="p-3 text-left hidden sm:table-cell">Performance</th>
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
                  <td className="p-3 hidden md:table-cell">
                    {new Date(ad.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {new Date(ad.end_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">${ad.budget}</td>
                  <td className="p-3 hidden sm:table-cell">
                    {`${ad.clicks || 0} clicks / ${ad.reach || 0} views`}
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

export default BusinessAdsDashboard;
