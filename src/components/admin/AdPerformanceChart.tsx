
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Advertisement } from "@/services/adService";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AdPerformanceChartProps {
  data: Advertisement[];
}

export const AdPerformanceChart = ({ data }: AdPerformanceChartProps) => {
  const [timeRange, setTimeRange] = useState("30");
  const [metric, setMetric] = useState("impressions");
  const [chartType, setChartType] = useState("line");
  
  // This is a simplified example - in a real app, we would process data based on actual timestamps
  // and aggregate by days, weeks, or months
  
  // Mock data for the chart
  const generateChartData = () => {
    const days = parseInt(timeRange);
    const result = [];
    
    // Generate mock data for each day
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Calculate a value based on the total impressions/clicks, with some daily variance
      const baseValue = metric === "impressions" 
        ? data.reduce((sum, ad) => sum + (ad.reach || 0), 0) / (days + 1)
        : data.reduce((sum, ad) => sum + (ad.clicks || 0), 0) / (days + 1);
      
      // Add some randomness to make the chart look realistic
      const randomFactor = 0.5 + Math.random();
      
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(baseValue * randomFactor),
      });
    }
    
    return result;
  };
  
  const chartData = generateChartData();
  
  // Top performing ads
  const topAds = [...data]
    .sort((a, b) => {
      if (metric === "impressions") {
        return (b.reach || 0) - (a.reach || 0);
      }
      return (b.clicks || 0) - (a.clicks || 0);
    })
    .slice(0, 5);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Tabs value={metric} onValueChange={setMetric} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="impressions">Impressions</TabsTrigger>
              <TabsTrigger value="clicks">Clicks</TabsTrigger>
              <TabsTrigger value="ctr">CTR</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center ml-4">
            <Button 
              variant={chartType === "line" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartType("line")}
              className="rounded-r-none"
            >
              Line
            </Button>
            <Button 
              variant={chartType === "bar" ? "default" : "outline"} 
              size="sm"
              onClick={() => setChartType("bar")}
              className="rounded-l-none"
            >
              Bar
            </Button>
          </div>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="h-[350px]">
            <CardHeader className="pb-0">
              <CardTitle>
                {metric === "impressions" && "Ad Impressions"}
                {metric === "clicks" && "Ad Clicks"}
                {metric === "ctr" && "Click-Through Rate (%)"}
              </CardTitle>
              <CardDescription>
                Last {timeRange} days performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                {chartType === "line" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name={
                        metric === "impressions" ? "Impressions" : 
                        metric === "clicks" ? "Clicks" : "CTR (%)"
                      }
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      dot={{ r: 3 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name={
                        metric === "impressions" ? "Impressions" : 
                        metric === "clicks" ? "Clicks" : "CTR (%)"
                      }
                      fill="#8884d8" 
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-[350px]">
            <CardHeader>
              <CardTitle>Top Performing Ads</CardTitle>
              <CardDescription>
                By {metric === "impressions" ? "impressions" : metric === "clicks" ? "clicks" : "click-through rate"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAds.length > 0 ? (
                  topAds.map((ad, index) => (
                    <div key={ad.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 text-center font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="truncate font-medium">{ad.title}</div>
                        <div className="text-xs text-muted-foreground">{ad.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {metric === "impressions" && (ad.reach?.toLocaleString() || "0")}
                          {metric === "clicks" && (ad.clicks?.toLocaleString() || "0")}
                          {metric === "ctr" && (
                            ad.reach 
                              ? (((ad.clicks || 0) / ad.reach) * 100).toFixed(2) + "%" 
                              : "0%"
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
