
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTimestamp, getMemoryUsageTrend, calculateAverageMemoryUsage } from '../utils/metricCalculations';

interface MemoryUsageChartProps {
  data: any[];
}

export const MemoryUsageChart = ({ data }: MemoryUsageChartProps) => {
  const memoryData = getMemoryUsageTrend(data);
  const avgMemoryUsage = calculateAverageMemoryUsage(data);
  
  // Define warning thresholds
  const WARNING_THRESHOLD = 80;
  const CRITICAL_THRESHOLD = 90;
  
  // Determine status color based on memory usage
  const getStatusColor = (value: number) => {
    if (value >= CRITICAL_THRESHOLD) return '#ef4444'; // red
    if (value >= WARNING_THRESHOLD) return '#f59e0b'; // amber
    return '#22c55e'; // green
  };
  
  const statusColor = getStatusColor(avgMemoryUsage);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Memory usage over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Avg Usage:</span>
            <span 
              className="font-bold px-2 py-1 rounded-md text-white"
              style={{ backgroundColor: statusColor }}
            >
              {avgMemoryUsage}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {memoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => formatTimestamp(value as string)}
                  formatter={(value) => [`${value}%`, 'Memory Usage']}
                />
                <Legend />
                <ReferenceLine y={WARNING_THRESHOLD} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={CRITICAL_THRESHOLD} stroke="#ef4444" strokeDasharray="3 3" />
                <Bar
                  dataKey="memory_usage"
                  name="Memory Usage (%)"
                  fill="#8884d8"
                  // Color bars based on value
                  isAnimationActive={false}
                  label={{ position: 'top', formatter: (value: number) => `${value}%` }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No memory usage data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
