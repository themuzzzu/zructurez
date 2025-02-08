
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from 'react';

export const PerformanceDashboard = () => {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'performance_metrics'
        },
        (payload) => {
          setRealtimeData(current => [payload.new, ...current].slice(0, 100));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const combinedData = [...(realtimeData || []), ...(metrics || [])].slice(0, 100);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isLoading) {
    return <div>Loading performance metrics...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Response Times</CardTitle>
          <CardDescription>Average response time by endpoint over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatTimestamp(value as string)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="response_time"
                  stroke="#e31837"
                  name="Response Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Endpoint success vs failure ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round((combinedData.filter(m => m.success).length / combinedData.length) * 100)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Errors</CardTitle>
            <CardDescription>Most recent error messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {combinedData
                .filter(m => !m.success && m.error_message)
                .slice(0, 5)
                .map((error, i) => (
                  <div key={i} className="text-sm text-destructive">
                    {error.error_message}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
