
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
  Activity 
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

// Utility to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Mock data generator functions
const generateDateRangeData = (days: number, baseValue: number, variance: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    return {
      date: date.toISOString().slice(0, 10),
      value: Math.max(0, baseValue + Math.random() * variance - variance / 2),
      secondValue: Math.max(0, (baseValue * 0.7) + Math.random() * variance - variance / 2)
    };
  });
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

const ViewsBarGraph = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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

const RevenueLineGraph = ({ data, isLoading }: { data: any[]; isLoading: boolean }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
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
  // For a simple heatmap visualization, we're using a bar chart
  // In a real implementation, a proper heatmap library would be better
  
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
  const handleExport = () => {
    toast.success("Report downloaded successfully!");
    // In a real implementation, this would generate and download a CSV/PDF file
  };
  
  return (
    <Button onClick={handleExport} className="flex items-center gap-2">
      <DownloadCloud className="h-4 w-4" />
      Export Report
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
  
  // Demo data states - in a real implementation these would come from API calls
  const [summaryData, setSummaryData] = useState({
    totalViews: 12548,
    totalWishlists: 825,
    projectedRevenue: 45250,
    totalPurchases: 142
  });
  
  const [viewsData, setViewsData] = useState<any[]>([]);
  const [wishlistPurchaseData, setWishlistPurchaseData] = useState<any>({
    wishlist_count: 825,
    purchase_count: 142
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any>({
    conversion_rate: 0.0113,
    total_views: 12548,
    total_wishlists: 825,
    total_purchases: 142
  });
  
  // Function to generate mock data based on time range
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      // Simulate API loading time
      setTimeout(() => {
        // Generate views and wishlists data
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const newViewsData = generateDateRangeData(days, 400, 200).map(item => ({
          date: item.date,
          views: Math.floor(item.value),
          wishlists: Math.floor(item.value * 0.07)
        }));
        
        // Generate revenue data
        const newRevenueData = generateDateRangeData(days, 1500, 800).map(item => ({
          date: item.date,
          revenue: Math.floor(item.value),
          projected: Math.floor(item.value * 1.2)
        }));
        
        // Generate engagement heatmap data
        const newEngagementData = Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}`,
          engagement: Math.floor(Math.random() * 100) + (i >= 8 && i <= 22 ? 30 : 0)
        }));
        
        setViewsData(newViewsData);
        setRevenueData(newRevenueData);
        setEngagementData(newEngagementData);
        setIsLoading(false);
        setLastUpdate(new Date().toLocaleTimeString());
      }, 800);
    };
    
    loadData();
  }, [timeRange]);
  
  const handleRefresh = () => {
    toast.info("Refreshing analytics data...");
    // Trigger data reload
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date().toLocaleTimeString());
      toast.success("Analytics data refreshed");
    }, 800);
  };
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Views" 
          value={formatNumber(summaryData.totalViews)} 
          icon={Eye}
          change={12.5}
          changeType="positive"
        />
        <SummaryCard 
          title="Total Wishlists" 
          value={formatNumber(summaryData.totalWishlists)} 
          icon={Heart}
          change={8.3}
          changeType="positive"
        />
        <SummaryCard 
          title="Total Purchases" 
          value={formatNumber(summaryData.totalPurchases)} 
          icon={ShoppingBag}
          change={5.2}
          changeType="positive"
        />
        <SummaryCard 
          title="Projected Revenue" 
          value={`₹${formatNumber(summaryData.projectedRevenue)}`} 
          icon={DollarSign}
          change={9.7}
          changeType="positive"
        />
      </div>
      
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
                <ViewsBarGraph data={viewsData} isLoading={isLoading} />
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
                <WishlistPieChart data={wishlistPurchaseData} isLoading={isLoading} />
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
                <RevenueLineGraph data={revenueData} isLoading={isLoading} />
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
                <EngagementHeatmap data={engagementData} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ConversionRate data={conversionData} isLoading={isLoading} />
            <DropOffRate data={conversionData} isLoading={isLoading} />
            <BestPostingTimes data={engagementData} isLoading={isLoading} />
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
                  You have <span className="text-red-500 font-medium">683 users</span> who added products to their wishlist but haven't purchased yet. 
                  Consider sending a limited-time discount offer to convert these potential customers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <LiveUpdate lastUpdate={lastUpdate} onRefresh={handleRefresh} />
      </div>
    </div>
  );
};
