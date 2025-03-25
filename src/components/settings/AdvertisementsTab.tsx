
import { AdDashboard } from "@/components/ads/AdDashboard";
import { AIAdRecommendations } from "@/components/ads/AIAdRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const AdvertisementsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Management</CardTitle>
        </CardHeader>
        <CardContent>
          <AdDashboard />
        </CardContent>
      </Card>
      
      <Separator />
      
      <AIAdRecommendations />
    </div>
  );
};
