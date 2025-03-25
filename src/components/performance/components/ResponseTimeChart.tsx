
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
    <Card className="w-full">
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-lg md:text-xl">Response Times</CardTitle>
        <CardDescription className="text-sm">Average response time by endpoint over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                labelFormatter={(value) => formatTimestamp(value as string)}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
              <Line
                type="monotone"
                dataKey="response_time"
                stroke="#e31837"
                name="Response Time (ms)"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
