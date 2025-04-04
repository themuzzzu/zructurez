
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateAdCampaign } from "@/components/ads/CreateAdCampaign";
import { BusinessAdsDashboard } from "@/components/ads/BusinessAdsDashboard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export const AdvertisingTab = ({ businessId }: { businessId?: string }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveAds, setHasActiveAds] = useState(false);

  useEffect(() => {
    const checkActiveAds = async () => {
      if (!businessId) return;

      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('id')
          .eq('business_id', businessId)
          .eq('status', 'active')
          .limit(1);

        if (error) throw error;
        setHasActiveAds(data && data.length > 0);
      } catch (error) {
        console.error('Error checking active ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkActiveAds();
  }, [businessId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Advertising</h2>
          <p className="text-muted-foreground">Promote your business with targeted advertisements</p>
        </div>
        
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Ad
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Ad Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Ad Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Advertisements</CardTitle>
              <CardDescription>
                Manage your current and past ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading your advertisements...</p>
                </div>
              ) : !hasActiveAds ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No active advertisements</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    You don't have any active ad campaigns at the moment. Create your first ad to increase your visibility.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first ad
                  </Button>
                </div>
              ) : (
                <BusinessAdsDashboard businessId={businessId} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance</CardTitle>
              <CardDescription>
                View detailed analytics for your ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-muted-foreground">Total Impressions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-muted-foreground">Total Clicks</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-muted-foreground">Average CTR</p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />
              
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  Detailed analytics will appear here once your ads start generating impressions and clicks.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Settings</CardTitle>
              <CardDescription>
                Customize your advertising preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  Ad settings and preferences will be available here in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateAdCampaign 
            businessId={businessId} 
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              setHasActiveAds(true);
              toast.success("Ad campaign created successfully");
            }}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvertisingTab;
