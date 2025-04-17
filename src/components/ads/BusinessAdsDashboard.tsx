
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Plus, Calendar, ChevronRight, Bar, BarChart, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Advertisement } from "@/types/advertisement";

interface BusinessAdsDashboardProps {
  businessId?: string;
}

export const BusinessAdsDashboard = ({ businessId }: BusinessAdsDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);

  const { data: adCampaigns = [], refetch, isLoading: isLoadingQuery } = useQuery({
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

      return data as Advertisement[];
    },
    enabled: !!businessId
  });

  const refreshData = async () => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
    toast({
      title: "Ad campaigns refreshed",
    });
  };

  // Filter ads by status
  const activeAds = adCampaigns.filter(ad => ad.status === 'active');
  const pendingAds = adCampaigns.filter(ad => ad.status === 'pending');
  const expiredAds = adCampaigns.filter(ad => ad.status === 'expired' || ad.status === 'completed');

  if (isLoadingQuery) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ad Campaigns</h3>
        <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeAds.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reach</p>
                <p className="text-2xl font-bold">
                  {adCampaigns.reduce((sum, ad) => sum + (ad.reach || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clicks</p>
                <p className="text-2xl font-bold">
                  {adCampaigns.reduce((sum, ad) => sum + (ad.clicks || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/20">
                <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              {activeAds.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {pendingAds.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired
            <Badge variant="secondary" className="ml-2">
              {expiredAds.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>
                Your currently running ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAds.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active campaigns</p>
                  </div>
                ) : (
                  activeAds.map((ad) => (
                    <CampaignCard key={ad.id} ad={ad} onDelete={() => refreshData()} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Review</CardTitle>
              <CardDescription>
                Campaigns waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAds.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending campaigns</p>
                  </div>
                ) : (
                  pendingAds.map((ad) => (
                    <CampaignCard key={ad.id} ad={ad} onDelete={() => refreshData()} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Campaigns</CardTitle>
              <CardDescription>
                Past campaigns that are no longer running
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiredAds.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No expired campaigns</p>
                  </div>
                ) : (
                  expiredAds.map((ad) => (
                    <CampaignCard key={ad.id} ad={ad} onDelete={() => refreshData()} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CampaignCardProps {
  ad: Advertisement;
  onDelete: () => void;
}

const CampaignCard = ({ ad, onDelete }: CampaignCardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAd = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", ad.id);
        
      if (error) throw error;
      
      toast({
        title: "Campaign deleted",
      });
      onDelete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete campaign",
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const viewDetails = () => {
    // In a real app, this would navigate to a detailed view
    toast({
      title: "View ad details",
      description: `Viewing details for ${ad.title}`,
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {ad.image_url && (
          <div className="md:col-span-1 h-full">
            <img 
              src={ad.image_url} 
              alt={ad.title} 
              className="w-full h-full object-cover aspect-video md:aspect-square"
            />
          </div>
        )}
        <div className={`p-4 ${ad.image_url ? 'md:col-span-4' : 'md:col-span-5'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{ad.title}</h4>
              <p className="text-sm text-muted-foreground">{ad.description}</p>
            </div>
            <Badge variant={ad.status === "active" ? "success" : ad.status === "pending" ? "warning" : "destructive"}>
              {ad.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-sm font-medium">{ad.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-medium">₹{ad.budget}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium">{format(new Date(ad.start_date), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="text-sm font-medium">{format(new Date(ad.end_date), 'dd MMM yyyy')}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Impressions</p>
                <p className="text-sm font-medium">{ad.impressions || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Clicks</p>
                <p className="text-sm font-medium">{ad.clicks || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CTR</p>
                <p className="text-sm font-medium">
                  {ad.impressions ? ((ad.clicks || 0) / ad.impressions * 100).toFixed(2) : 0}%
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={viewDetails}>
                Details
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={deleteAd} 
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusinessAdsDashboard;
