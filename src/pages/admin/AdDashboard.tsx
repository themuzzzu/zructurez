
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { subDays, format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { createQueryKey } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";

interface AdPerformance {
  date: string;
  impressions: number;
  clicks: number;
  reach: number;
}

interface AdData {
  start_date: string;
  impressions?: number;
  clicks?: number;
  reach?: number;
}

const AdDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [adsData, setAdsData] = useState<AdPerformance[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'impressions' | 'clicks' | 'reach'>('impressions');

  // Use React Query for caching and better performance
  const { data: advertisementData, isLoading } = useQuery({
    queryKey: createQueryKey('advertisements-performance', {
      fromDate: format(dateRange.from, 'yyyy-MM-dd'),
      toDate: format(dateRange.to, 'yyyy-MM-dd')
    }),
    queryFn: async () => {
      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('advertisements')
        .select('start_date, impressions, clicks, reach')
        .gte('start_date', fromDate)
        .lte('start_date', toDate);

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Process data when it changes
  useEffect(() => {
    if (!isLoading && advertisementData) {
      // Process the data to aggregate daily performance
      const dailyPerformance: { [date: string]: AdPerformance } = {};

      advertisementData.forEach((item: any) => {
        // Skip invalid items
        if (!item || typeof item !== 'object' || !item.start_date) {
          return;
        }

        const date = format(new Date(item.start_date), 'yyyy-MM-dd');
        if (!dailyPerformance[date]) {
          dailyPerformance[date] = {
            date,
            impressions: 0,
            clicks: 0,
            reach: 0,
          };
        }
        
        dailyPerformance[date].impressions += item.impressions || 0;
        dailyPerformance[date].clicks += item.clicks || 0;
        dailyPerformance[date].reach += item.reach || 0;
      });

      // Convert to array
      setAdsData(Object.values(dailyPerformance));
    }
  }, [advertisementData, isLoading]);

  const chartData = adsData.map(item => ({
    date: item.date,
    [selectedMetric]: item[selectedMetric],
  }));

  const DateFilterSection = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Date Range</h3>
        <DateRangePicker 
          date={dateRange}
          onChange={(range) => setDateRange(range)}
        />
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDateRange({ 
              from: subDays(new Date(), 7), 
              to: new Date() 
            })}
          >
            Last 7 days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDateRange({ 
              from: subDays(new Date(), 30), 
              to: new Date() 
            })}
          >
            Last 30 days
          </Button>
        </div>
      </div>
    );
  };

  const MetricSelector = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Select Metric</h3>
        <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as 'impressions' | 'clicks' | 'reach')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impressions">Impressions</SelectItem>
            <SelectItem value="clicks">Clicks</SelectItem>
            <SelectItem value="reach">Reach</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const PerformanceChart = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ad Performance Chart</CardTitle>
          <CardDescription>
            Visual representation of ad performance over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedMetric} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Ad Performance Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateFilterSection />
          <MetricSelector />
        </div>

        <div className="mt-8">
          <PerformanceChart />
        </div>
      </div>
    </Layout>
  );
};

export default AdDashboard;
