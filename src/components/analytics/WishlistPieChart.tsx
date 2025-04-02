
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface WishlistPurchaseData {
  wishlist_count: number;
  purchase_count: number;
}

interface WishlistPieChartProps {
  data: WishlistPurchaseData;
  isLoading: boolean;
}

export const WishlistPieChart = ({ data, isLoading }: WishlistPieChartProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  const pieData = [
    { name: 'Wishlisted', value: data?.wishlist_count || 0 },
    { name: 'Purchased', value: data?.purchase_count || 0 }
  ];
  
  const COLORS = ['#8b5cf6', '#3b82f6'];

  // Check if there's no data
  if (pieData.every(item => item.value === 0)) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No wishlist or purchase data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
