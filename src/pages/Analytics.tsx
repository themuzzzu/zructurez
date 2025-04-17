
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, LineChart, PieChart } from "lucide-react";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dummy data for analytics - in a real app this would come from your backend
  const analyticsData = {
    visitors: [
      { date: "Jan", value: 120 },
      { date: "Feb", value: 150 },
      { date: "Mar", value: 180 },
      { date: "Apr", value: 220 },
      { date: "May", value: 280 },
      { date: "Jun", value: 320 },
    ],
    revenue: [
      { date: "Jan", value: 500 },
      { date: "Feb", value: 620 },
      { date: "Mar", value: 750 },
      { date: "Apr", value: 890 },
      { date: "May", value: 950 },
      { date: "Jun", value: 1100 },
    ],
    engagement: [
      { name: "Views", value: 45 },
      { name: "Likes", value: 25 },
      { name: "Shares", value: 15 },
      { name: "Comments", value: 15 },
    ]
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="text-3xl font-bold">3,745</div>
            <p className="text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="text-3xl font-bold">$2,380</div>
            <p className="text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="text-3xl font-bold">286</div>
            <p className="text-muted-foreground">New Customers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="traffic">
            <LineChart className="h-4 w-4 mr-2" />
            Traffic
          </TabsTrigger>
          <TabsTrigger value="sales">
            <LineChart className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="engagement">
            <PieChart className="h-4 w-4 mr-2" />
            Engagement
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Visitors</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* In a real app, you'd use a chart library like recharts here */}
                <div className="h-full flex items-end justify-between gap-2">
                  {analyticsData.visitors.map((item) => (
                    <div key={item.date} className="flex flex-col items-center">
                      <div 
                        className="bg-primary rounded-t-md w-12" 
                        style={{ height: `${(item.value / 320) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2">{item.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* Placeholder for revenue chart */}
                <div className="h-full flex items-end justify-between gap-2">
                  {analyticsData.revenue.map((item) => (
                    <div key={item.date} className="flex flex-col items-center">
                      <div 
                        className="bg-green-500 rounded-t-md w-12" 
                        style={{ height: `${(item.value / 1100) * 100}%` }}
                      ></div>
                      <span className="text-xs mt-2">{item.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Traffic analytics data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Sales analytics data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Audience Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Engagement analytics data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
