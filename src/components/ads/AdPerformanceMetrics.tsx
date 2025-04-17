
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdCampaign } from "@/services/adService";

interface AdPerformanceMetricsProps {
  ads: AdCampaign[];
}

export const AdPerformanceMetrics = ({ ads }: AdPerformanceMetricsProps) => {
  const [activeTab, setActiveTab] = useState("clicks");
  
  // Process data for charts
  const typePerformance = processTypePerformance(ads);
  const dailyPerformance = processDailyPerformance(ads);
  
  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground">No ad data available to display metrics</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create and run ads to see performance data
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="clicks">Clicks by Ad Type</TabsTrigger>
          <TabsTrigger value="impressions">Impressions by Ad Type</TabsTrigger>
          <TabsTrigger value="timeline">Performance Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typePerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" fill="#8884d8" name="Total Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impressions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typePerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impressions" fill="#82ca9d" name="Total Impressions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="clicks"
                      stroke="#8884d8"
                      name="Clicks"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="impressions"
                      stroke="#82ca9d"
                      name="Impressions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Click-Through Rate" 
          value={calculateCTR(ads)} 
          format="percentage" 
        />
        <MetricCard 
          title="Cost per Click" 
          value={calculateCPC(ads)} 
          format="currency" 
        />
        <MetricCard 
          title="Total Ad Spend" 
          value={calculateTotalSpend(ads)} 
          format="currency" 
        />
      </div>
    </div>
  );
};

// Helper components
const MetricCard = ({ title, value, format }) => {
  const formattedValue = format === "percentage" 
    ? `${value.toFixed(2)}%` 
    : format === "currency" 
    ? `$${value.toFixed(2)}` 
    : value;

  return (
    <Card>
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{formattedValue}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Data processing functions
function processTypePerformance(ads: AdCampaign[]) {
  const typeMap = new Map();
  
  ads.forEach(ad => {
    if (!typeMap.has(ad.type)) {
      typeMap.set(ad.type, { type: ad.type, clicks: 0, impressions: 0 });
    }
    
    const typeData = typeMap.get(ad.type);
    typeData.clicks += ad.clicks || 0;
    typeData.impressions += ad.reach || 0;
  });
  
  return Array.from(typeMap.values());
}

function processDailyPerformance(ads: AdCampaign[]) {
  // This is simplified - in a real app, you might query for daily aggregates
  // Here we're creating mock daily data based on campaign timeframes
  const today = new Date();
  const dailyData = [];
  
  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Base clicks and impressions
    const baseFactor = Math.sin(i / 5) + 1; // Creates some natural variation
    
    let dailyClicks = Math.floor(5 * baseFactor);
    let dailyImpressions = Math.floor(50 * baseFactor);
    
    // Add actual data from ads that were active on this date
    ads.forEach(ad => {
      const startDate = new Date(ad.start_date);
      const endDate = new Date(ad.end_date);
      
      if (date >= startDate && date <= endDate) {
        // Distribute clicks and impressions across the date range
        const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) || 1;
        dailyClicks += (ad.clicks || 0) / campaignDays;
        dailyImpressions += (ad.reach || 0) / campaignDays;
      }
    });
    
    dailyData.push({
      date: dateStr,
      clicks: Math.round(dailyClicks),
      impressions: Math.round(dailyImpressions)
    });
  }
  
  return dailyData;
}

function calculateCTR(ads: AdCampaign[]): number {
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.reach || 0), 0);
  
  return totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
}

function calculateCPC(ads: AdCampaign[]): number {
  const totalSpend = ads.reduce((sum, ad) => sum + (ad.budget || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  
  return totalClicks > 0 ? totalSpend / totalClicks : 0;
}

function calculateTotalSpend(ads: AdCampaign[]): number {
  return ads.reduce((sum, ad) => sum + (ad.budget || 0), 0);
}

export default AdPerformanceMetrics;
