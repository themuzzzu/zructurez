
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
    <Card className="w-full">
      <CardHeader className="pb-2 md:pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg md:text-xl">Memory Usage</CardTitle>
            <CardDescription className="text-sm">Memory usage over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium">Avg Usage:</span>
            <span 
              className="font-bold px-2 py-1 rounded-md text-white text-xs md:text-sm"
              style={{ backgroundColor: statusColor }}
            >
              {avgMemoryUsage}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] md:h-[300px]">
          {memoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  tick={{ fontSize: 10 }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip 
                  labelFormatter={(value) => formatTimestamp(value as string)}
                  formatter={(value) => [`${value}%`, 'Memory Usage']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
                <ReferenceLine y={WARNING_THRESHOLD} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={CRITICAL_THRESHOLD} stroke="#ef4444" strokeDasharray="3 3" />
                <Bar
                  dataKey="memory_usage"
                  name="Memory Usage (%)"
                  fill="#8884d8"
                  isAnimationActive={false}
                  label={{ 
                    position: 'top', 
                    formatter: (value: number) => `${value}%`,
                    fontSize: 10 
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No memory usage data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
