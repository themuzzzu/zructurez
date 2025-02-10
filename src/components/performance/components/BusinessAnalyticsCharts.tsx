
import { Card } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsData {
  views: number;
  products_sold: number;
  bookings: number;
  subscriptions: number;
  revenue: number;
  date: string;
}

interface BusinessAnalyticsChartsProps {
  data: AnalyticsData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const BusinessAnalyticsCharts = ({ data }: BusinessAnalyticsChartsProps) => {
  // Prepare data for pie chart
  const pieData = [
    { name: 'Products', value: data.reduce((sum, d) => sum + d.products_sold, 0) },
    { name: 'Bookings', value: data.reduce((sum, d) => sum + d.bookings, 0) },
    { name: 'Subscriptions', value: data.reduce((sum, d) => sum + d.subscriptions, 0) }
  ];

  return (
    <div className="space-y-6">
      {/* Views Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Page Views Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Distribution Pie Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
