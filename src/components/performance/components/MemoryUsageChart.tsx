
import {
  BarChart,
  Bar,
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
import { formatTimestamp, getMemoryUsageTrend } from '../utils/metricCalculations';

interface MemoryUsageChartProps {
  data: any[];
}

export const MemoryUsageChart = ({ data }: MemoryUsageChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Usage</CardTitle>
        <CardDescription>Memory usage over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getMemoryUsageTrend(data)}>
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
  );
};
