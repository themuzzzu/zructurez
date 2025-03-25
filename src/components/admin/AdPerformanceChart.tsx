
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Advertisement } from "@/services/adService";

interface AdPerformanceChartProps {
  data: Advertisement[];
}

export function AdPerformanceChart({ data }: AdPerformanceChartProps) {
  // Group data by ad type for the chart
  const groupedData = data.reduce((acc: any, ad) => {
    const type = ad.type;
    if (!acc[type]) {
      acc[type] = {
        name: type.charAt(0).toUpperCase() + type.slice(1),
        impressions: 0,
        clicks: 0,
        ctr: 0
      };
    }
    
    acc[type].impressions += ad.reach || 0;
    acc[type].clicks += ad.clicks || 0;
    
    return acc;
  }, {});
  
  // Calculate CTR for each type
  Object.values(groupedData).forEach((group: any) => {
    group.ctr = group.impressions > 0 
      ? ((group.clicks / group.impressions) * 100).toFixed(2) 
      : 0;
  });
  
  const chartData = Object.values(groupedData);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="impressions" name="Impressions" fill="#8884d8" />
        <Bar yAxisId="left" dataKey="clicks" name="Clicks" fill="#82ca9d" />
        <Bar yAxisId="right" dataKey="ctr" name="CTR (%)" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}
