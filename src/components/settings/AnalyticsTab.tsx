
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
  Clock,
  Lock
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Utility to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Default data objects to handle empty states
const defaultWishlistPurchaseData = {
  wishlist_count: 0,
  purchase_count: 0
};

const defaultConversionData = {
  conversion_rate: 0,
  total_views: 0,
  total_wishlists: 0,
  total_purchases: 0
};

// Main Analytics Tab Component
export const AnalyticsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  // Get the user's current plan
  const { data: userPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      return data;
    },
    enabled: !!user
  });
  
  // Determine plan level (default to "basic" if no plan is found)
  const planLevel = userPlan?.plan_id || "basic";
  
  // Define which features are available based on plan
  const features = {
    views: true, // Available in all plans
    clicks: ["pro", "pro-plus", "master"].includes(planLevel),
    wishlists: ["pro-plus", "master"].includes(planLevel),
    purchases: ["pro-plus", "master"].includes(planLevel),
    revenue: ["master"].includes(planLevel),
    engagementHours: ["pro-plus", "master"].includes(planLevel),
    dropOffRate: ["master"].includes(planLevel),
    bestPostingTimes: ["master"].includes(planLevel),
    export: ["master"].includes(planLevel)
  };
  
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
        features.wishlists && refetchWishlist(),
        features.revenue && refetchRevenue(),
        features.engagementHours && refetchEngagement(),
        features.wishlists && refetchConversion()
      ].filter(Boolean));
      
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
      if (newActivity.type === 'purchase' && features.purchases) {
        toast.info(`New purchase: ${newActivity.message}`);
      } else if (newActivity.type === 'view_spike') {
        toast.info(`Traffic spike: ${newActivity.message}`);
      }
      
      // Refresh data when significant updates happen
      handleRefresh();
    }
  }, [newActivity]);

  const handleUpgradeClick = () => {
    navigate("/settings/pricing");
    toast.info("Upgrade your plan to unlock more analytics features");
  };
  
  // Render a locked feature component
  const LockedFeature = ({ title, description }: { title: string, description: string }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
        <Lock className="h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-center max-w-xs mb-3">{description}</p>
        <Button onClick={handleUpgradeClick} variant="default">Upgrade Plan</Button>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-muted/20"></div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-muted-foreground">
            Track your business performance and customer engagement
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isPlanLoading && (
            <Badge variant="outline" className="font-medium">
              {planLevel === "pro" ? "Pro Plan" : 
               planLevel === "pro-plus" ? "Pro+ Plan" : 
               planLevel === "master" ? "Master Plan" : "Basic Plan"}
            </Badge>
          )}
          {features.export ? (
            <ExportReport onExport={() => toast.success("Report downloaded successfully!")} />
          ) : (
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleUpgradeClick}>
              <DownloadCloud className="h-4 w-4" />
              <span className="hidden md:inline">Export Reports</span>
              <Lock className="h-3 w-3 ml-1" />
            </Button>
          )}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
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
        {features.clicks ? (
          <SummaryCard 
            title="Total Clicks" 
            value={formatNumber(summaryData?.totalClicks || 0)} 
            icon={TrendingUp}
            change={8.3}
            changeType="positive"
            isLoading={isSummaryLoading}
          />
        ) : (
          <SummaryCard 
            title="Total Clicks" 
            value="Locked"
            icon={Lock}
            isLocked={true}
            onUpgrade={handleUpgradeClick}
            isLoading={isSummaryLoading}
          />
        )}
        {features.wishlists ? (
          <SummaryCard 
            title="Total Wishlists" 
            value={formatNumber(summaryData?.totalWishlists || 0)} 
            icon={Heart}
            change={8.3}
            changeType="positive"
            isLoading={isSummaryLoading}
          />
        ) : (
          <SummaryCard 
            title="Total Wishlists" 
            value="Locked"
            icon={Lock}
            isLocked={true}
            onUpgrade={handleUpgradeClick}
            isLoading={isSummaryLoading}
          />
        )}
        {features.revenue ? (
          <SummaryCard 
            title="Projected Revenue" 
            value={`₹${formatNumber(summaryData?.projectedRevenue || 0)}`} 
            icon={DollarSign}
            change={9.7}
            changeType="positive"
            isLoading={isSummaryLoading}
          />
        ) : (
          <SummaryCard 
            title="Projected Revenue" 
            value="Locked"
            icon={Lock}
            isLocked={true}
            onUpgrade={handleUpgradeClick}
            isLoading={isSummaryLoading}
          />
        )}
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
                  Views Over Time
                </CardTitle>
                <CardDescription>
                  Track page views over time
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
            
            {features.wishlists ? (
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
                  <WishlistPieChart 
                    data={wishlistPurchaseData || defaultWishlistPurchaseData} 
                    isLoading={isWishlistLoading} 
                  />
                </CardContent>
              </Card>
            ) : (
              <LockedFeature 
                title="Wishlist Analytics" 
                description="Upgrade to Pro+ plan to see wishlist data and conversion rates" 
              />
            )}
            
            {features.revenue ? (
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
            ) : (
              <LockedFeature 
                title="Revenue Analytics" 
                description="Upgrade to Master plan to access revenue forecasting and trends" 
              />
            )}
            
            {features.engagementHours ? (
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
            ) : (
              <LockedFeature 
                title="Engagement Hours" 
                description="Upgrade to Pro+ plan to see when your audience is most active" 
              />
            )}
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.wishlists ? (
              <ConversionRate 
                data={conversionData || defaultConversionData} 
                isLoading={isConversionLoading} 
              />
            ) : (
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-4">
                  <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-semibold">Conversion Analytics</h3>
                  <p className="text-muted-foreground text-center mb-3">Upgrade to Pro+ plan to access conversion data</p>
                  <Button onClick={handleUpgradeClick} variant="default" size="sm">Upgrade Plan</Button>
                </div>
                <CardHeader>
                  <CardTitle>Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] bg-muted/20"></div>
                </CardContent>
              </Card>
            )}
            
            {features.dropOffRate ? (
              <DropOffRate 
                data={conversionData || defaultConversionData} 
                isLoading={isConversionLoading} 
              />
            ) : (
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-4">
                  <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-semibold">Drop-off Analytics</h3>
                  <p className="text-muted-foreground text-center mb-3">Upgrade to Master plan to see customer drop-off data</p>
                  <Button onClick={handleUpgradeClick} variant="default" size="sm">Upgrade Plan</Button>
                </div>
                <CardHeader>
                  <CardTitle>Drop-off Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] bg-muted/20"></div>
                </CardContent>
              </Card>
            )}
            
            {features.bestPostingTimes ? (
              <BestPostingTimes data={engagementData || []} isLoading={isEngagementLoading} />
            ) : (
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-4">
                  <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-semibold">Optimal Posting Times</h3>
                  <p className="text-muted-foreground text-center mb-3">Upgrade to Master plan to find the best times to post</p>
                  <Button onClick={handleUpgradeClick} variant="default" size="sm">Upgrade Plan</Button>
                </div>
                <CardHeader>
                  <CardTitle>Best Posting Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[150px] bg-muted/20"></div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* LiveUpdate Component */}
      <div className="flex justify-end">
        <LiveUpdate lastUpdate={lastUpdate} onRefresh={handleRefresh} isRefreshing={isLoading} />
      </div>

      {planLevel === "basic" && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Upgrade to unlock all analytics features</h3>
                <p className="text-muted-foreground mb-4">
                  Get valuable insights about your business performance, customer behavior, 
                  and revenue trends with our advanced analytics.
                </p>
              </div>
              <Button onClick={handleUpgradeClick} className="shrink-0">
                View Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
