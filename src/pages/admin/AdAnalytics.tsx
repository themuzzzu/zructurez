
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Download, BarChart, LineChart, Percent } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RBarChart, Bar } from 'recharts';

// Helper for demo data
const generateChartData = (days: number, baseValue: number, variance: number) => {
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

const AdAnalytics = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [selectedMetric, setSelectedMetric] = useState<string>("impressions");
  
  // Demo data for charts
  const impressionsData = generateChartData(30, 1000, 400);
  const clicksData = generateChartData(30, 50, 20);
  const ctrData = generateChartData(30, 3, 1).map(item => ({
    ...item,
    value: (item.value).toFixed(2)
  }));
  const conversionsData = generateChartData(30, 10, 5);
  const revenueData = generateChartData(30, 5000, 2000);
  
  // Fetch ad analytics
  const { data: analytics = [], isLoading, refetch } = useQuery({
    queryKey: ['ad-analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_analytics')
        .select(`
          id,
          impressions,
          clicks,
          conversions,
          ad_id,
          advertisements (
            id,
            title,
            type,
            status,
            budget,
            start_date,
            end_date
          )
        `)
        .order('impressions', { ascending: false });
        
      if (error) {
        toast.error("Failed to load analytics data");
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Calculate totals
  const totalImpressions = analytics.reduce((total, item) => total + (item.impressions || 0), 0);
  const totalClicks = analytics.reduce((total, item) => total + (item.clicks || 0), 0);
  const totalConversions = analytics.reduce((total, item) => total + (item.conversions || 0), 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0";
  const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : "0";
  
  // Get chart data based on selected metric
  const getChartData = () => {
    switch (selectedMetric) {
      case "impressions":
        return impressionsData;
      case "clicks":
        return clicksData;
      case "ctr":
        return ctrData;
      case "conversions":
        return conversionsData;
      case "revenue":
        return revenueData;
      default:
        return impressionsData;
    }
  };
  
  // Format numbers for display
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };
  
  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Analytics data refreshed");
  };
  
  // Export data
  const handleExport = () => {
    toast.info("Exporting analytics data...");
    // In a real implementation, this would generate and download a CSV/Excel file
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ad Analytics & Reporting</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatNumber(totalImpressions)}</div>
            <p className="text-muted-foreground">Impressions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatNumber(totalClicks)}</div>
            <p className="text-muted-foreground">Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{averageCTR}%</div>
            <p className="text-muted-foreground">CTR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatNumber(totalConversions)}</div>
            <p className="text-muted-foreground">Conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{averageConversionRate}%</div>
            <p className="text-muted-foreground">Conv. Rate</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Performance Metrics</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="clicks">Clicks</SelectItem>
                    <SelectItem value="ctr">CTR</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                {selectedMetric === "impressions" && "Total ad impressions over time"}
                {selectedMetric === "clicks" && "Total ad clicks over time"}
                {selectedMetric === "ctr" && "Click-through rate over time"}
                {selectedMetric === "conversions" && "Total conversions over time"}
                {selectedMetric === "revenue" && "Ad revenue over time"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                  {selectedMetric === "impressions" && (
                    <Line 
                      type="monotone" 
                      dataKey="secondValue" 
                      name="Unique Impressions" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                    />
                  )}
                </RLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Performance by Ad Type
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart data={[
                    { name: "Product", ctr: 3.8, convRate: 1.2 },
                    { name: "Banner", ctr: 2.5, convRate: 0.8 },
                    { name: "PPC", ctr: 4.2, convRate: 1.5 },
                    { name: "Recommendation", ctr: 3.2, convRate: 1.1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ctr" name="CTR (%)" fill="#3b82f6" />
                    <Bar dataKey="convRate" name="Conv. Rate (%)" fill="#f97316" />
                  </RBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2 text-primary" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart 
                    data={[
                      { name: "Impressions", value: 100 },
                      { name: "Clicks", value: Math.round((totalClicks / totalImpressions) * 100) || 5 },
                      { name: "Page Views", value: Math.round((totalClicks / totalImpressions) * 80) || 4 },
                      { name: "Add to Cart", value: Math.round((totalClicks / totalImpressions) * 40) || 2 },
                      { name: "Conversions", value: Math.round((totalConversions / totalImpressions) * 100) || 1 }
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Conversion Rate (%)" fill="#8884d8" />
                  </RBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Detailed analytics for all your ad campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                    <TableHead>Spend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        Loading analytics data...
                      </TableCell>
                    </TableRow>
                  ) : analytics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No campaign data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    analytics.map((item) => {
                      const advertisement = item.advertisements;
                      const ctr = item.impressions > 0 
                        ? (item.clicks / item.impressions * 100).toFixed(2) 
                        : "0";
                      const convRate = item.clicks > 0 
                        ? (item.conversions / item.clicks * 100).toFixed(2) 
                        : "0";
                        
                      // Calculate an estimated spend based on clicks and a made-up CPC
                      const estimatedCpc = 2.5; // Assume ₹2.5 per click
                      const spend = (item.clicks * estimatedCpc).toFixed(2);
                        
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {advertisement?.title || "Unknown Campaign"}
                          </TableCell>
                          <TableCell>
                            {advertisement?.type 
                              ? advertisement.type.charAt(0).toUpperCase() + advertisement.type.slice(1) 
                              : "Unknown"
                            }
                          </TableCell>
                          <TableCell>{formatNumber(item.impressions || 0)}</TableCell>
                          <TableCell>{formatNumber(item.clicks || 0)}</TableCell>
                          <TableCell>{ctr}%</TableCell>
                          <TableCell>{formatNumber(item.conversions || 0)}</TableCell>
                          <TableCell>{convRate}%</TableCell>
                          <TableCell>₹{formatNumber(parseFloat(spend))}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="placements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Placement Performance</CardTitle>
              <CardDescription>
                Analytics by ad placement location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart
                    data={[
                      { name: "Homepage Top", impressions: 15420, clicks: 542, ctr: 3.51 },
                      { name: "Search Results", impressions: 22180, clicks: 876, ctr: 3.95 },
                      { name: "Product Detail", impressions: 8760, clicks: 412, ctr: 4.70 },
                      { name: "Marketplace", impressions: 18940, clicks: 623, ctr: 3.29 },
                      { name: "Category Pages", impressions: 12450, clicks: 378, ctr: 3.04 },
                      { name: "Recommendations", impressions: 9870, clicks: 421, ctr: 4.27 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="impressions" name="Impressions" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="clicks" name="Clicks" fill="#82ca9d" />
                  </RBarChart>
                </ResponsiveContainer>
              </div>
              
              <Table className="mt-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>Placement</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Avg. CPC</TableHead>
                    <TableHead>Avg. CPM</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Homepage Top", impressions: 15420, clicks: 542, ctr: 3.51, cpc: 3.25, cpm: 12.50, revenue: 1761.50 },
                    { name: "Search Results", impressions: 22180, clicks: 876, ctr: 3.95, cpc: 2.95, cpm: 14.80, revenue: 2584.20 },
                    { name: "Product Detail", impressions: 8760, clicks: 412, ctr: 4.70, cpc: 3.45, cpm: 10.70, revenue: 1421.40 },
                    { name: "Marketplace", impressions: 18940, clicks: 623, ctr: 3.29, cpc: 2.75, cpm: 15.40, revenue: 1713.25 },
                    { name: "Category Pages", impressions: 12450, clicks: 378, ctr: 3.04, cpc: 2.45, cpm: 11.80, revenue: 926.10 },
                    { name: "Recommendations", impressions: 9870, clicks: 421, ctr: 4.27, cpc: 3.15, cpm: 13.50, revenue: 1326.15 }
                  ].map((placement, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{placement.name}</TableCell>
                      <TableCell>{formatNumber(placement.impressions)}</TableCell>
                      <TableCell>{formatNumber(placement.clicks)}</TableCell>
                      <TableCell>{placement.ctr}%</TableCell>
                      <TableCell>₹{placement.cpc}</TableCell>
                      <TableCell>₹{placement.cpm}</TableCell>
                      <TableCell>₹{formatNumber(placement.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Ad performance by user demographics and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Performance by Age Group</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RBarChart
                        data={[
                          { name: "18-24", impressions: 8540, clicks: 384, ctr: 4.50 },
                          { name: "25-34", impressions: 15230, clicks: 625, ctr: 4.10 },
                          { name: "35-44", impressions: 12760, clicks: 498, ctr: 3.90 },
                          { name: "45-54", impressions: 8420, clicks: 287, ctr: 3.41 },
                          { name: "55+", impressions: 5150, clicks: 165, ctr: 3.20 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ctr" name="CTR (%)" fill="#3b82f6" />
                      </RBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Performance by Interest</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RLineChart
                        data={[
                          { name: "Technology", ctr: 4.85, convRate: 1.7 },
                          { name: "Fashion", ctr: 3.65, convRate: 1.2 },
                          { name: "Home", ctr: 3.25, convRate: 0.9 },
                          { name: "Sports", ctr: 3.75, convRate: 1.1 },
                          { name: "Beauty", ctr: 4.15, convRate: 1.5 },
                          { name: "Travel", ctr: 3.45, convRate: 1.0 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="ctr" name="CTR (%)" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="convRate" name="Conv. Rate (%)" stroke="#f97316" strokeWidth={2} />
                      </RLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-8 mb-4">Location-Based Performance</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Delhi", impressions: 12540, clicks: 485, ctr: 3.87, convRate: 1.45, revenue: 1548.25 },
                    { name: "Mumbai", impressions: 15830, clicks: 612, ctr: 3.87, convRate: 1.32, revenue: 1874.16 },
                    { name: "Bangalore", impressions: 10420, clicks: 437, ctr: 4.19, convRate: 1.58, revenue: 1453.61 },
                    { name: "Hyderabad", impressions: 8750, clicks: 352, ctr: 4.02, convRate: 1.27, revenue: 1103.76 },
                    { name: "Chennai", impressions: 7650, clicks: 298, ctr: 3.90, convRate: 1.21, revenue: 924.98 },
                    { name: "Other Cities", impressions: 24810, clicks: 875, ctr: 3.53, convRate: 1.12, revenue: 2734.38 }
                  ].map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{formatNumber(location.impressions)}</TableCell>
                      <TableCell>{formatNumber(location.clicks)}</TableCell>
                      <TableCell>{location.ctr}%</TableCell>
                      <TableCell>{location.convRate}%</TableCell>
                      <TableCell>₹{formatNumber(location.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdAnalytics;
