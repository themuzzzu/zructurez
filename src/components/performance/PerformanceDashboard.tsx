
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
  ResponsiveContainer,
  BarChart,
  Bar
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'performance_metrics',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setRealtimeData(current => [payload.new, ...current].slice(0, 100));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, []);

  const combinedData = [...(realtimeData || []), ...(metrics || [])].slice(0, 100);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const calculateAverageResponseTime = () => {
    if (combinedData.length === 0) return 0;
    const sum = combinedData.reduce((acc, curr) => acc + curr.response_time, 0);
    return Math.round(sum / combinedData.length);
  };

  const calculateSuccessRate = () => {
    if (combinedData.length === 0) return 0;
    const successCount = combinedData.filter(m => m.success).length;
    return Math.round((successCount / combinedData.length) * 100);
  };

  const getMemoryUsageTrend = () => {
    return combinedData
      .filter(m => m.memory_usage != null)
      .map(m => ({
        timestamp: m.timestamp,
        memory_usage: Math.round(m.memory_usage * 100) / 100
      }));
  };

  if (isLoading) {
    return <div>Loading performance metrics...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Avg Response Time</CardTitle>
            <CardDescription>Average API response time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {calculateAverageResponseTime()}ms
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>API call success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {calculateSuccessRate()}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Currently active users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {combinedData[0]?.concurrent_users || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Memory Usage</CardTitle>
          <CardDescription>Memory usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMemoryUsageTrend()}>
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
                <Bar
                  dataKey="memory_usage"
                  fill="#8884d8"
                  name="Memory Usage (%)"
                />
              </BarChart>
            </ResponsiveContainer>
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
  );
};
