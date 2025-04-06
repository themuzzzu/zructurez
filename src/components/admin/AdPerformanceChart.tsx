
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Advertisement } from "@/services/adService";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdPerformanceChartProps {
  ads: Advertisement[];
}

export function AdPerformanceChart({ ads }: AdPerformanceChartProps) {
  const [metric, setMetric] = useState<"impressions" | "clicks" | "reach">("impressions");
  
  const getChartData = () => {
    return ads.map(ad => ({
      name: ad.title.substring(0, 15) + (ad.title.length > 15 ? "..." : ""),
      [metric]: ad[metric] || 0
    }));
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Performance Metrics</h3>
          <Select defaultValue="impressions" onValueChange={(value) => setMetric(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="impressions">Impressions</SelectItem>
              <SelectItem value="clicks">Clicks</SelectItem>
              <SelectItem value="reach">Reach</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey={metric} 
                fill={metric === "impressions" ? "#8884d8" : metric === "clicks" ? "#82ca9d" : "#ffc658"} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
