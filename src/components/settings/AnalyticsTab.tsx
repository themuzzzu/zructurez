
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  Clock, 
  RefreshCw, 
  BarChart2, 
  PieChart, 
  LineChart, 
  Activity,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Pie, 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { useBusinessAnalytics } from "../performance/hooks/useBusinessAnalytics";
import { useAnalyticsSummary } from "@/hooks/analytics/useAnalyticsSummary";
import { useWishlistPurchase } from "@/hooks/analytics/useWishlistPurchase";
import { useRevenueData } from "@/hooks/analytics/useRevenueData";
import { useEngagementData } from "@/hooks/analytics/useEngagementData";
import { useConversionData } from "@/hooks/analytics/useConversionData";
import { useLiveUpdates } from "@/hooks/analytics/useLiveUpdates";
import { useViewsData } from "@/hooks/analytics/useViewsData";

// Utility to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Components for Analytics Dashboard
const SummaryCard = ({ title, value, icon: Icon, change, changeType }: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  change?: number; 
  changeType?: 'positive' | 'negative' | 'neutral' 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {changeType === 'positive' && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {changeType === 'negative' && <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />}
                <span className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-500' : 
                  changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ViewsBarGraph = ({ data, isLoading, timeRange }: { data: any[]; isLoading: boolean; timeRange: string }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  // Filter data based on time range
  const filteredData = data.slice(0, timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" name="Views" fill="#3b82f6" />
        <Bar dataKey="wishlists" name="Wishlists" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const WishlistPieChart = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
  const pieData = [
    { name: 'Wishlisted', value: data?.wishlist_count || 0 },
    { name: 'Purchased', value: data?.purchase_count || 0 }
  ];
  
  const COLORS = ['#8b5cf6', '#3b82f6'];
  
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
};

const RevenueLineGraph = ({ data, isLoading, timeRange }: { data: any[]; isLoading: boolean; timeRange: string }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  // Filter data based on time range
  const filteredData = data.slice(0, timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="projected" name="Projected" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

const EngagementHeatmap = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="engagement" name="Engagement" fill="#f97316" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ConversionRate = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[100px]" />;
  }
  
  const conversionRatePercent = (data?.conversion_rate || 0) * 100;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-primary">
            {conversionRatePercent.toFixed(2)}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Of all views, {conversionRatePercent.toFixed(2)}% convert to purchases
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const DropOffRate = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[100px]" />;
  }
  
  const dropOffRatePercent = 100 - ((data?.conversion_rate || 0) * 100);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Drop-Off Rate</h3>
          <div className="text-3xl font-bold text-red-500">
            {dropOffRatePercent.toFixed(2)}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Users who view but don't purchase
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const BestPostingTimes = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[100px]" />;
  }
  
  // Find the best 3 posting times based on engagement
  const bestTimes = [...data]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 3)
    .map(item => `${item.hour}:00`);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Best Posting Times</h3>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {bestTimes.map((time, index) => (
              <div key={index} className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                {time}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            AI-recommended times based on historical engagement
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ExportReport = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // In a real implementation, this would fetch data and generate a CSV/PDF
      // Simulating a delay for the download process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a sample CSV content (in a real app, this would be dynamic)
      const csvContent = [
        "Date,Views,Wishlists,Orders,Revenue",
        "2023-06-01,120,15,5,25000",
        "2023-06-02,135,18,7,35000",
        "2023-06-03,110,12,4,20000"
      ].join("\n");
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button 
      onClick={handleExport} 
      className="flex items-center gap-2"
      disabled={isExporting}
    >
      {isExporting ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <DownloadCloud className="h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export Report"}
    </Button>
  );
};

const LiveUpdate = ({ lastUpdate, onRefresh }: { lastUpdate: string; onRefresh: () => void }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Last updated: {lastUpdate}</span>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Main Analytics Tab Component
export const AnalyticsTab = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  // Use custom hooks for data fetching
  const { data: summaryData, refetch: refetchSummary } = useAnalyticsSummary(user?.id);
  const { data: viewsData, refetch: refetchViews } = useViewsData(user?.id, timeRange);
  const { data: wishlistPurchaseData, refetch: refetchWishlist } = useWishlistPurchase(user?.id);
  const { data: revenueData, refetch: refetchRevenue } = useRevenueData(user?.id, timeRange);
  const { data: engagementData, refetch: refetchEngagement } = useEngagementData(user?.id);
  const { data: conversionData, refetch: refetchConversion } = useConversionData(user?.id);
  
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
          <ExportReport />
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
        />
        <SummaryCard 
          title="Total Wishlists" 
          value={formatNumber(summaryData?.totalWishlists || 0)} 
          icon={Heart}
          change={8.3}
          changeType="positive"
        />
        <SummaryCard 
          title="Total Purchases" 
          value={formatNumber(summaryData?.totalPurchases || 0)} 
          icon={ShoppingBag}
          change={5.2}
          changeType="positive"
        />
        <SummaryCard 
          title="Projected Revenue" 
          value={`₹${formatNumber(summaryData?.projectedRevenue || 0)}`} 
          icon={DollarSign}
          change={9.7}
          changeType="positive"
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
                  isLoading={isLoading} 
                  timeRange={timeRange}
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
                <WishlistPieChart data={wishlistPurchaseData || {}} isLoading={isLoading} />
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
                  isLoading={isLoading} 
                  timeRange={timeRange}
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
                <EngagementHeatmap data={engagementData || []} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ConversionRate data={conversionData || {}} isLoading={isLoading} />
            <DropOffRate data={conversionData || {}} isLoading={isLoading} />
            <BestPostingTimes data={engagementData || []} isLoading={isLoading} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Data-driven recommendations for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Sales Forecast
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Based on current trends, you're projected to see a <span className="text-green-500 font-medium">15% increase</span> in sales next month. 
                  Consider running a promotion on your top-performing product to maximize this growth.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Posting Optimization
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Your audience is most active between <span className="text-amber-500 font-medium">6 PM and 9 PM</span>. 
                  Schedule your product updates and posts during these hours for maximum visibility.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Conversion Opportunity
                </h3>
                <p className="mt-2 text-muted-foreground">
                  You have <span className="text-red-500 font-medium">{summaryData?.totalWishlists - summaryData?.totalPurchases || 0} users</span> who added products to their wishlist but haven't purchased yet. 
                  Consider sending a limited-time discount offer to convert these potential customers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* LiveUpdate Component */}
      <div className="flex justify-end">
        <LiveUpdate lastUpdate={lastUpdate} onRefresh={handleRefresh} />
      </div>
    </div>
  );
};
