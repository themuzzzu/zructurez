
import { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { addDays, format } from "date-fns";

interface InventoryForecastChartProps {
  inventoryData: any[];
  isLoading: boolean;
}

export const InventoryForecastChart = ({ 
  inventoryData, 
  isLoading
}: InventoryForecastChartProps) => {
  // Generate AI forecast data for inventory levels
  const forecastData = useMemo(() => {
    if (!inventoryData.length) return [];
    
    // Take top 5 products by views (popular products)
    const topProducts = [...inventoryData]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
    
    // Generate simulated forecast data based on current stock and views
    const today = new Date();
    const forecast = [];
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dateKey = format(date, 'MMM dd');
      
      const forecasted: Record<string, number> = { date: dateKey };
      
      topProducts.forEach(product => {
        // Simple forecasting logic - more views means faster stock depletion
        const viewsPerDay = (product.views || 10) / 30;
        const depletion = Math.max(0, product.stock - (viewsPerDay * i * 0.1));
        forecasted[product.title] = parseFloat(depletion.toFixed(1));
      });
      
      forecast.push(forecasted);
    }
    
    return forecast;
  }, [inventoryData]);
  
  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>Loading forecast data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (forecastData.length === 0) {
    return (
      <Card className="p-6">
        <CardContent className="flex items-center justify-center h-[300px]">
          <p>No inventory data available for forecasting</p>
        </CardContent>
      </Card>
    );
  }
  
  // Generate colors for each product
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];
  
  // Get product names from the first data point
  const productNames = Object.keys(forecastData[0]).filter(key => key !== 'date');
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={forecastData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {productNames.map((product, index) => (
          <Area
            key={product}
            type="monotone"
            dataKey={product}
            stackId="1"
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
