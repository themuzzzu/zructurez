
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  CalendarDays,
  TrendingUp,
  Users,
  ShoppingBag,
  Eye,
  DollarSign,
  Clock,
  RefreshCw,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Filter,
  UserCheck,
  MapPin,
  Activity
} from "lucide-react";
import { SummaryCard } from "@/components/analytics/SummaryCard";
import { AIInsights } from "@/components/analytics/AIInsights";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Analytics = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"overview" | "traffic" | "sales" | "engagement">("overview");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("line");
  
  // Mock data - in a real app, this would be replaced with API calls
  const mockPageViewsData = [
    { date: "Mon", views: 2340 },
    { date: "Tue", views: 1840 },
    { date: "Wed", views: 2900 },
    { date: "Thu", views: 2780 },
    { date: "Fri", views: 3908 },
    { date: "Sat", views: 3800 },
    { date: "Sun", views: 4300 }
  ];
  
  const mockUserData = [
    { date: "Mon", newUsers: 120, activeUsers: 340 },
    { date: "Tue", newUsers: 90, activeUsers: 290 },
    { date: "Wed", newUsers: 110, activeUsers: 320 },
    { date: "Thu", newUsers: 130, activeUsers: 380 },
    { date: "Fri", newUsers: 170, activeUsers: 440 },
    { date: "Sat", newUsers: 160, activeUsers: 420 },
    { date: "Sun", newUsers: 190, activeUsers: 490 }
  ];
  
  const mockSalesData = [
    { date: "Mon", sales: 2100 },
    { date: "Tue", sales: 1800 },
    { date: "Wed", sales: 2200 },
    { date: "Thu", sales: 2400 },
    { date: "Fri", sales: 3100 },
    { date: "Sat", sales: 2900 },
    { date: "Sun", sales: 3300 }
  ];
  
  const mockEngagementData = [
    { date: "Mon", likes: 234, comments: 84, shares: 42 },
    { date: "Tue", likes: 184, comments: 72, shares: 38 },
    { date: "Wed", likes: 290, comments: 120, shares: 52 },
    { date: "Thu", likes: 278, comments: 94, shares: 48 },
    { date: "Fri", likes: 390, comments: 140, shares: 68 },
    { date: "Sat", likes: 380, comments: 135, shares: 64 },
    { date: "Sun", likes: 430, comments: 152, shares: 82 }
  ];
  
  const mockSourcesData = [
    { name: "Direct", value: 35 },
    { name: "Search", value: 25 },
    { name: "Social", value: 20 },
    { name: "Referral", value: 15 },
    { name: "Email", value: 5 }
  ];
  
  const mockDeviceData = [
    { name: "Mobile", value: 60 },
    { name: "Desktop", value: 35 },
    { name: "Tablet", value: 5 }
  ];
  
  const mockLocationData = [
    { name: "Hyderabad", value: 35 },
    { name: "Bangalore", value: 25 },
    { name: "Chennai", value: 15 },
    { name: "Mumbai", value: 12 },
    { name: "Delhi", value: 8 },
    { name: "Other", value: 5 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DCF', '#FF6663'];
  
  // Fetch user's business data
  const { data: businessData, isLoading: businessLoading } = useQuery({
    queryKey: ['user-businesses', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  
  // Fetch business analytics
  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['business-analytics', businessData?.id],
    queryFn: async () => {
      if (!businessData?.id) return null;
      
      const { data, error } = await supabase
        .from('business_analytics')
        .select('*')
        .eq('business_id', businessData.id)
        .single();
        
      if (error) return null;
      return data;
    },
    enabled: !!businessData?.id
  });
  
  // Fetch order data for the business
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['business-orders', businessData?.id],
    queryFn: async () => {
      if (!businessData?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', businessData.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!businessData?.id
  });
  
  // Fetch wishlists and purchase data
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ['product-wishlists', businessData?.id],
    queryFn: async () => {
      if (!businessData?.id) return { count: 0 };
      
      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessData.id);
        
      if (error) throw error;
      
      return { count: count || 0 };
    },
    enabled: !!businessData?.id
  });
  
  const refreshData = async () => {
    setIsRefreshing(true);
    await refetchAnalytics();
    setIsRefreshing(false);
  };
  
  // Calculate totals
  const totalPageViews = analyticsData?.page_views || 0;
  const totalEngagement = mockEngagementData.reduce((sum, item) => sum + item.likes + item.comments + item.shares, 0);
  const totalSales = orderData?.length || 0;
  const conversionRate = totalPageViews > 0 ? ((totalSales / totalPageViews) * 100).toFixed(2) : "0";
  
  // Loading state
  const isLoading = businessLoading || analyticsLoading || orderLoading || wishlistLoading;
  
  // Handle empty state
  const hasBusinessData = !!businessData;
  
  const renderChart = () => {
    switch (viewMode) {
      case "traffic":
        if (chartType === "bar") {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockPageViewsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" name="Page Views" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if (chartType === "line") {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockPageViewsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" name="Page Views" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={mockSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );
        }
      
      case "sales":
        if (chartType === "bar") {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Legend />
                <Bar dataKey="sales" name="Sales ($)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if (chartType === "line") {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockSalesData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="Sales ($)" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={mockLocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockLocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );
        }
      
      case "engagement":
        if (chartType === "bar") {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockEngagementData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" name="Likes" fill="#6366f1" />
                <Bar dataKey="comments" name="Comments" fill="#ec4899" />
                <Bar dataKey="shares" name="Shares" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          );
        } else if (chartType === "line") {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockEngagementData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likes" name="Likes" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" name="Comments" stroke="#ec4899" strokeWidth={2} />
                <Line type="monotone" dataKey="shares" name="Shares" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={mockDeviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockDeviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );
        }
      
      default: // overview
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockUserData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };
  
  if (!hasBusinessData && !isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">No Business Found</h1>
            <p className="text-muted-foreground mb-6">
              You need to create a business to access analytics features.
            </p>
            <Button>Create Business</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading analytics data..." : `Analytics for ${businessData?.name || "your business"}`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing || isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard
              title="Page Views"
              value={totalPageViews}
              icon={Eye}
              change={12}
              changeType="positive"
            />
            <SummaryCard
              title="Total Sales"
              value={totalSales}
              icon={ShoppingBag}
              change={8.5}
              changeType="positive"
            />
            <SummaryCard
              title="Engagement"
              value={totalEngagement}
              icon={Activity}
              change={15.2}
              changeType="positive"
            />
            <SummaryCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              icon={TrendingUp}
              change={5.3}
              changeType="positive"
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Analytics {viewMode !== "overview" ? `- ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}` : ""}</CardTitle>
                  <CardDescription>
                    {viewMode === "traffic" && "Page views and user traffic analytics"}
                    {viewMode === "sales" && "Sales performance and revenue analytics"}
                    {viewMode === "engagement" && "User engagement and interaction metrics"}
                    {viewMode === "overview" && "Overview of key performance metrics"}
                  </CardDescription>
                </div>
                
                <div className="flex gap-2">
                  <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="hidden md:block">
                    <TabsList>
                      <TabsTrigger value="overview">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="traffic">
                        <Users className="h-4 w-4 mr-2" />
                        Traffic
                      </TabsTrigger>
                      <TabsTrigger value="sales">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Sales
                      </TabsTrigger>
                      <TabsTrigger value="engagement">
                        <Activity className="h-4 w-4 mr-2" />
                        Engagement
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="md:hidden">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="traffic">Traffic</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex rounded-md overflow-hidden border">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setChartType("bar")}
                      className={cn(
                        "rounded-none",
                        chartType === "bar" && "bg-muted"
                      )}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setChartType("line")}
                      className={cn(
                        "rounded-none",
                        chartType === "line" && "bg-muted"
                      )}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setChartType("pie")}
                      className={cn(
                        "rounded-none",
                        chartType === "pie" && "bg-muted"
                      )}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>{renderChart()}</CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex">
                        <div className="mr-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary/10">
                          <Eye className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            <span className="font-bold">285</span> new page views today
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <CalendarDays className="inline h-3 w-3 mr-1" />
                            Today at 10:45 AM
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            15% increase from yesterday
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-green-500/10">
                          <ShoppingBag className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            <span className="font-bold">12</span> new sales completed
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <CalendarDays className="inline h-3 w-3 mr-1" />
                            Today at 09:24 AM
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            $1,248 in revenue
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-blue-500/10">
                          <UserCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            <span className="font-bold">18</span> new customer registrations
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <CalendarDays className="inline h-3 w-3 mr-1" />
                            Yesterday at 16:32 PM
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            52% from social media
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-yellow-500/10">
                          <MapPin className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            <span className="font-bold">5</span> new locations added to visibility
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <CalendarDays className="inline h-3 w-3 mr-1" />
                            2 days ago
                          </p>
                          <div className="flex gap-2 mt-2">
                            {["Hyderabad", "Chennai", "Pune", "+2 more"].map((city) => (
                              <Badge key={city} variant="secondary" className="text-xs">
                                {city}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <AIInsights 
                  wishlistCount={(wishlistData?.count || 0) + 48}
                  purchaseCount={(orderData?.length || 0) + 23}
                  isLoading={isLoading}
                />
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Your most successful products by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Product</th>
                        <th scope="col" className="px-6 py-3">Views</th>
                        <th scope="col" className="px-6 py-3">Conversions</th>
                        <th scope="col" className="px-6 py-3">Revenue</th>
                        <th scope="col" className="px-6 py-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Premium Service Package", views: 1240, conversions: 124, revenue: 6200, rating: 4.8 },
                        { name: "Standard Monthly Subscription", views: 840, conversions: 68, revenue: 2720, rating: 4.5 },
                        { name: "Pro Business Solution", views: 650, conversions: 45, revenue: 4500, rating: 4.7 },
                        { name: "Entry Level Package", views: 1850, conversions: 92, revenue: 2300, rating: 4.2 },
                        { name: "Custom Enterprise Solution", views: 320, conversions: 12, revenue: 9600, rating: 5.0 }
                      ].map((product, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-6 py-4 font-medium">{product.name}</td>
                          <td className="px-6 py-4">{product.views.toLocaleString()}</td>
                          <td className="px-6 py-4">{product.conversions} ({((product.conversions / product.views) * 100).toFixed(1)}%)</td>
                          <td className="px-6 py-4">${product.revenue.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="mr-2">{product.rating}</span>
                              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yellow-400" 
                                  style={{ width: `${(product.rating / 5) * 100}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
              <CardHeader>
                <CardTitle>Unlock Advanced Analytics</CardTitle>
                <CardDescription>
                  Upgrade your plan to get access to advanced analytics features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <Badge variant="outline" className="mb-2">Pro Feature</Badge>
                    <h3 className="text-lg font-medium mb-1">Predictive Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered sales forecasting and trend prediction
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <Badge variant="outline" className="mb-2">Pro Feature</Badge>
                    <h3 className="text-lg font-medium mb-1">Competitor Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Compare your performance against similar businesses
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <Badge variant="outline" className="mb-2">Pro Feature</Badge>
                    <h3 className="text-lg font-medium mb-1">Custom Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and schedule custom analytics reports
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button className="px-8">Upgrade to Pro</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

const LoadingState = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex">
                <Skeleton className="h-[42px] w-[42px] rounded-full mr-4" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Analytics;
