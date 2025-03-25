
import { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";
import { format, subDays, subMonths, subYears, isAfter, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface SalesPerformanceChartProps {
  salesData: any[];
  isLoading: boolean;
  dateRange: "daily" | "weekly" | "monthly" | "yearly";
}

export const SalesPerformanceChart = ({ 
  salesData, 
  isLoading,
  dateRange 
}: SalesPerformanceChartProps) => {
  const filteredData = useMemo(() => {
    if (!salesData.length) return [];
    
    const now = new Date();
    let cutoffDate;
    
    switch (dateRange) {
      case 'daily':
        cutoffDate = subDays(now, 7);
        break;
      case 'weekly':
        cutoffDate = subMonths(now, 3);
        break;
      case 'monthly':
        cutoffDate = subMonths(now, 12);
        break;
      case 'yearly':
        cutoffDate = subYears(now, 5);
        break;
      default:
        cutoffDate = subMonths(now, 12);
    }
    
    return salesData.filter(order => isAfter(parseISO(order.created_at), cutoffDate));
  }, [salesData, dateRange]);
  
  const chartData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const aggregatedData: Record<string, { revenue: number, orders: number }> = {};
    
    filteredData.forEach(order => {
      let dateKey;
      const orderDate = parseISO(order.created_at);
      
      switch (dateRange) {
        case 'daily':
          dateKey = format(orderDate, 'yyyy-MM-dd');
          break;
        case 'weekly':
          dateKey = `Week ${format(orderDate, 'w, yyyy')}`;
          break;
        case 'monthly':
          dateKey = format(orderDate, 'MMM yyyy');
          break;
        case 'yearly':
          dateKey = format(orderDate, 'yyyy');
          break;
        default:
          dateKey = format(orderDate, 'MMM yyyy');
      }
      
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { revenue: 0, orders: 0 };
      }
      
      aggregatedData[dateKey].revenue += order.total_price;
      aggregatedData[dateKey].orders += 1;
    });
    
    // Convert to array for chart
    return Object.entries(aggregatedData).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, dateRange]);
  
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>Loading sales data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>No sales data available for the selected period</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="revenue" 
          name="Revenue (₹)" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="orders" 
          name="Orders" 
          stroke="#82ca9d" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
