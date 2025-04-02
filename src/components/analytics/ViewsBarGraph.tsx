
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewData {
  date: string;
  views: number;
  wishlists: number;
}

interface ViewsBarGraphProps {
  data: ViewData[];
  isLoading: boolean;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const ViewsBarGraph = ({ 
  data, 
  isLoading, 
  timeRange,
  onTimeRangeChange
}: ViewsBarGraphProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  // Filter data based on time range
  const filteredData = data.length > 0 ? data.slice(0, timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90) : [];

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col h-[300px]">
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2">
            {["7d", "30d", "90d"].map((range) => (
              <Button 
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeRangeChange(range)}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 text-muted-foreground">
          No data available for the selected time range
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button 
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filteredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="views" name="Views" fill="#3b82f6" />
          <Bar dataKey="wishlists" name="Wishlists" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
