
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Calendar, 
  Lock, 
  PieChart as PieChartIcon, 
  BarChart2, 
  TrendingUp, 
  Eye, 
  Heart,
  Share2,
  ArrowUpRight 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AnalyticsSummary } from "@/types/subscription";

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsTab = () => {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const { user } = useAuth();
  
  // Get user plan data
  const { data: userPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('name', 'basic')
        .maybeSingle();
      
      return { plan_id: data?.id || "basic" };
    },
    enabled: !!user
  });
  
  // Determine plan level (default to "basic" if no plan is found)
  const planLevel = userPlan?.plan_id || "basic";
  
  // Define which features are available based on plan
  const features = {
    basicAnalytics: true, // Available in all plans
    advancedAnalytics: ["pro", "pro-plus", "master"].includes(planLevel),
    detailedCharts: ["pro-plus", "master"].includes(planLevel),
  };
  
  // Get analytics data
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics', user?.id, period],
    queryFn: async () => {
      if (!user) return null;
      
      // In a real app, this would fetch from a dedicated analytics table
      // For demo purposes, let's create mock data
      const viewsData = [];
      const likesData = [];
      const sharesData = [];
      const clicksData = [];
      
      // Generate data points based on period
      const dataPoints = period === "7d" ? 7 : period === "30d" ? 30 : 90;
      const today = new Date();
      
      let totalViews = 0;
      let totalLikes = 0;
      let totalShares = 0;
      let totalClicks = 0;
      
      for (let i = 0; i < dataPoints; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (dataPoints - i - 1));
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Generate random but consistent data
        const views = Math.floor(Math.random() * 100) + 10;
        const likes = Math.floor(views * (Math.random() * 0.3 + 0.05));
        const shares = Math.floor(likes * (Math.random() * 0.3 + 0.05));
        const clicks = Math.floor(views * (Math.random() * 0.4 + 0.1));
        
        totalViews += views;
        totalLikes += likes;
        totalShares += shares;
        totalClicks += clicks;
        
        viewsData.push({ date: formattedDate, value: views });
        likesData.push({ date: formattedDate, value: likes });
        sharesData.push({ date: formattedDate, value: shares });
        clicksData.push({ date: formattedDate, value: clicks });
      }
      
      // For pie chart
      const contentDistribution = [
        { name: "Products", value: 45 },
        { name: "Services", value: 30 },
        { name: "Posts", value: 15 },
        { name: "Comments", value: 10 }
      ];
      
      // For category performance
      const categoryPerformance = [
        { name: "Electronics", views: 512, engagement: 78 },
        { name: "Clothing", views: 430, engagement: 65 },
        { name: "Home", views: 320, engagement: 42 },
        { name: "Services", views: 280, engagement: 38 },
        { name: "Other", views: 190, engagement: 25 }
      ];
      
      const summary: AnalyticsSummary = {
        totalViews,
        totalLikes,
        totalShares,
        totalClicks
      };
      
      return {
        views: viewsData,
        likes: likesData,
        shares: sharesData,
        clicks: clicksData,
        contentDistribution,
        categoryPerformance,
        summary
      };
    },
    enabled: !!user
  });
  
  if (isAnalyticsLoading || isPlanLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Track your content performance</p>
        </div>
        
        <div className="flex gap-2">
          <Tabs defaultValue={period} value={period} onValueChange={(v) => setPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs defaultValue={chartType} value={chartType} onValueChange={(v) => setChartType(v as any)}>
            <TabsList>
              <TabsTrigger value="line" title="Line Chart">
                <TrendingUp className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="bar" title="Bar Chart">
                <BarChart2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="pie" title="Pie Chart">
                <PieChartIcon className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Key metrics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Views</span>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{analytics?.summary.totalViews.toLocaleString()}</div>
            <Progress value={100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Likes</span>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold">{analytics?.summary.totalLikes.toLocaleString()}</div>
            <Progress value={(analytics?.summary.totalLikes || 0) / (analytics?.summary.totalViews || 1) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Shares</span>
              <Share2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{analytics?.summary.totalShares.toLocaleString()}</div>
            <Progress value={(analytics?.summary.totalShares || 0) / (analytics?.summary.totalViews || 1) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground text-sm">Clicks</span>
              <ArrowUpRight className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{analytics?.summary.totalClicks.toLocaleString()}</div>
            <Progress value={(analytics?.summary.totalClicks || 0) / (analytics?.summary.totalViews || 1) * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      {/* Main chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics?.views}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Views" stroke="#0088FE" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.views}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Views" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === "pie" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.contentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {analytics?.contentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
