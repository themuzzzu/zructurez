
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RevenueData {
  date: string;
  revenue: number;
  projected: number;
}

interface RevenueLineGraphProps {
  data: RevenueData[];
  isLoading: boolean;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const RevenueLineGraph = ({ 
  data, 
  isLoading,
  timeRange,
  onTimeRangeChange
}: RevenueLineGraphProps) => {
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
          No revenue data available for the selected time range
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
        <LineChart
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
          <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
          <Legend />
          <Line type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="projected" name="Projected Revenue" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
