
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface EngagementData {
  hour: string;
  engagement: number;
}

interface EngagementHeatmapProps {
  data: EngagementData[];
  isLoading: boolean;
}

export const EngagementHeatmap = ({ data, isLoading }: EngagementHeatmapProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No engagement data available
      </div>
    );
  }

  // Sort data by hour to ensure it's in chronological order
  const sortedData = [...data].sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  // Format hour labels (24h to 12h format)
  const formatHour = (hour: string) => {
    const hourNum = parseInt(hour);
    if (hourNum === 0) return '12 AM';
    if (hourNum === 12) return '12 PM';
    return hourNum < 12 ? `${hourNum} AM` : `${hourNum - 12} PM`;
  };

  // Get color based on engagement level
  const getBarColor = (value: number) => {
    if (value < 20) return '#94a3b8'; // low - slate-400
    if (value < 40) return '#60a5fa'; // medium - blue-400
    if (value < 60) return '#2563eb'; // high - blue-600
    return '#f97316'; // very high - orange-500
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tickFormatter={formatHour}
            label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Engagement Level', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`Level: ${value}`, 'Engagement']}
            labelFormatter={formatHour}
          />
          <Bar 
            dataKey="engagement" 
            name="User Engagement"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            // Apply dynamic coloring based on engagement level
            {... {cell: sortedData.map((entry) => ({
              fill: getBarColor(entry.engagement)
            }))}}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
