
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud, 
  TrendingUp, 
  Eye, 
  Heart, 
  ShoppingBag, 
  DollarSign, 
  RefreshCw, 
  BarChart2, 
  PieChart, 
  LineChart, 
  Activity,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalyticsSummary } from "@/hooks/analytics/useAnalyticsSummary";
import { useWishlistPurchase } from "@/hooks/analytics/useWishlistPurchase";
import { useRevenueData } from "@/hooks/analytics/useRevenueData";
import { useEngagementData } from "@/hooks/analytics/useEngagementData";
import { useConversionData } from "@/hooks/analytics/useConversionData";
import { useLiveUpdates } from "@/hooks/analytics/useLiveUpdates";
import { useViewsData } from "@/hooks/analytics/useViewsData";

// Import analytics components
import { SummaryCard } from "../analytics/SummaryCard";
import { ViewsBarGraph } from "../analytics/ViewsBarGraph";
import { WishlistPieChart } from "../analytics/WishlistPieChart";
import { RevenueLineGraph } from "../analytics/RevenueLineGraph";
import { EngagementHeatmap } from "../analytics/EngagementHeatmap";
import { ConversionRate } from "../analytics/ConversionRate";
import { DropOffRate } from "../analytics/DropOffRate";
import { BestPostingTimes } from "../analytics/BestPostingTimes";
import { ExportReport } from "../analytics/ExportReport";
import { LiveUpdate } from "../analytics/LiveUpdate";
import { AIInsights } from "../analytics/AIInsights";

// Utility to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Main Analytics Tab Component
export const AnalyticsTab = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  // Use custom hooks for data fetching
  const { data: summaryData, refetch: refetchSummary, isLoading: isSummaryLoading } = useAnalyticsSummary(user?.id);
  const { data: viewsData, refetch: refetchViews, isLoading: isViewsLoading } = useViewsData(user?.id, timeRange);
  const { data: wishlistPurchaseData, refetch: refetchWishlist, isLoading: isWishlistLoading } = useWishlistPurchase(user?.id);
  const { data: revenueData, refetch: refetchRevenue, isLoading: isRevenueLoading } = useRevenueData(user?.id, timeRange);
  const { data: engagementData, refetch: refetchEngagement, isLoading: isEngagementLoading } = useEngagementData(user?.id);
  const { data: conversionData, refetch: refetchConversion, isLoading: isConversionLoading } = useConversionData(user?.id);
  
  // Use live updates hook
  const { newActivity } = useLiveUpdates(user?.id);
  
  // Refresh all data
  const handleRefresh = async () => {
    setIsLoading(true);
    toast.info("Refreshing analytics data...");
    
    try {
      await Promise.all([
        refetchSummary(),
        refetchViews(),
        refetchWishlist(),
        refetchRevenue(),
        refetchEngagement(),
        refetchConversion()
      ]);
      
      setLastUpdate(new Date().toLocaleTimeString());
      toast.success("Analytics data refreshed");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to handle new activity notifications
  useEffect(() => {
    if (newActivity) {
      // Update the timestamp
      setLastUpdate(new Date().toLocaleTimeString());
      
      // Show a notification if it's significant activity
      if (newActivity.type === 'purchase') {
        toast.info(`New purchase: ${newActivity.message}`);
      } else if (newActivity.type === 'view_spike') {
        toast.info(`Traffic spike: ${newActivity.message}`);
      }
      
      // Refresh data when significant updates happen
      handleRefresh();
    }
  }, [newActivity]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Analytics</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <ExportReport onExport={() => toast.success("Report downloaded successfully!")} />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Views" 
          value={formatNumber(summaryData?.totalViews || 0)} 
          icon={Eye}
          change={12.5}
          changeType="positive"
          isLoading={isSummaryLoading}
        />
        <SummaryCard 
          title="Total Wishlists" 
          value={formatNumber(summaryData?.totalWishlists || 0)} 
          icon={Heart}
          change={8.3}
          changeType="positive"
          isLoading={isSummaryLoading}
        />
        <SummaryCard 
          title="Total Purchases" 
          value={formatNumber(summaryData?.totalPurchases || 0)} 
          icon={ShoppingBag}
          change={5.2}
          changeType="positive"
          isLoading={isSummaryLoading}
        />
        <SummaryCard 
          title="Projected Revenue" 
          value={`₹${formatNumber(summaryData?.projectedRevenue || 0)}`} 
          icon={DollarSign}
          change={9.7}
          changeType="positive"
          isLoading={isSummaryLoading}
        />
      </div>
      
      {/* Tabs for Charts and Insights */}
      <Tabs defaultValue="graphs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graphs" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Graphs & Charts
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Engagement Insights
          </TabsTrigger>
        </TabsList>
        
        {/* Charts Tab */}
        <TabsContent value="graphs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Views & Wishlists
                </CardTitle>
                <CardDescription>
                  Track user engagement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ViewsBarGraph 
                  data={viewsData || []} 
                  isLoading={isViewsLoading} 
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Wishlist vs. Purchases
                </CardTitle>
                <CardDescription>
                  Conversion from wishlist to purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WishlistPieChart data={wishlistPurchaseData || {}} isLoading={isWishlistLoading} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>
                  Actual vs. projected revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueLineGraph 
                  data={revenueData || []} 
                  isLoading={isRevenueLoading} 
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Peak Engagement Hours
                </CardTitle>
                <CardDescription>
                  When your audience is most active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EngagementHeatmap data={engagementData || []} isLoading={isEngagementLoading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ConversionRate data={conversionData || {}} isLoading={isConversionLoading} />
            <DropOffRate data={conversionData || {}} isLoading={isConversionLoading} />
            <BestPostingTimes data={engagementData || []} isLoading={isEngagementLoading} />
          </div>
          
          <AIInsights 
            wishlistCount={summaryData?.totalWishlists || 0} 
            purchaseCount={summaryData?.totalPurchases || 0} 
            isLoading={isSummaryLoading}
          />
        </TabsContent>
      </Tabs>
      
      {/* LiveUpdate Component */}
      <div className="flex justify-end">
        <LiveUpdate lastUpdate={lastUpdate} onRefresh={handleRefresh} isRefreshing={isLoading} />
      </div>
    </div>
  );
};
