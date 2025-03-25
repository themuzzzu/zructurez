
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
            <LineChart 
              data={data} 
              margin={{ 
                top: 5, 
                right: 5, 
                left: 0, 
                bottom: 20 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                tick={{ fontSize: 10 }}
                height={40}
                tickMargin={8}
                angle={-45}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                width={40}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip 
                labelFormatter={(value) => formatTimestamp(value as string)}
                contentStyle={{ 
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '11px', 
                  marginTop: '10px',
                  paddingTop: '10px'
                }} 
                verticalAlign="bottom" 
                height={36}
              />
              <Line
                type="monotone"
                dataKey="response_time"
                stroke="#e31837"
                name="Response Time (ms)"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
