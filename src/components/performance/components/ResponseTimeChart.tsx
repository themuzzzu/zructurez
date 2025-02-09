
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
import { formatTimestamp } from '../utils/metricCalculations';

interface ResponseTimeChartProps {
  data: any[];
}

export const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Times</CardTitle>
        <CardDescription>Average response time by endpoint over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
  );
};
