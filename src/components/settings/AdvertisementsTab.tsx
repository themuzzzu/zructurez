
import { useState, Suspense, lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { measureRenderTime } from "@/utils/performanceTracking";
import { AdvertisingTab } from "./AdvertisingTab";

// Lazy load heavy components
const LazyAdDashboard = lazy(() => import("@/components/ads/AdDashboard").then(
  module => ({ default: module.AdDashboard })
));
const LazyAIAdRecommendations = lazy(() => import("@/components/ads/AIAdRecommendations").then(
  module => ({ default: module.AIAdRecommendations })
));
const LazyPerformanceMetricsDashboard = lazy(() => import("@/components/performance/PerformanceMetricsDashboard").then(
  module => ({ default: module.PerformanceMetricsDashboard })
));

export const AdvertisementsTab = ({ businessId }: { businessId?: string }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return measureRenderTime('AdvertisementsTab', () => (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Ads Dashboard</TabsTrigger>
          <TabsTrigger value="create">Create Ads</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <LazyAdDashboard />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create & Manage Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <AdvertisingTab businessId={businessId} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
            <LazyAIAdRecommendations />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <LazyPerformanceMetricsDashboard />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />
    </div>
  ));
};

export default AdvertisementsTab;
