
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface InventoryForecastChartProps {
  data?: {
    date: string;
    current: number;
    predicted: number;
    reorderPoint?: number;
  }[];
  inventoryData?: any[];
  isLoading?: boolean;
}

export const InventoryForecastChart = ({ data = [], inventoryData, isLoading }: InventoryForecastChartProps) => {
  // Default data if none provided
  const defaultData = [
    { date: "Jun 1", current: 120, predicted: 120 },
    { date: "Jun 15", current: 100, predicted: 98 },
    { date: "Jul 1", current: 85, predicted: 82 },
    { date: "Jul 15", current: 70, predicted: 65 },
    { date: "Aug 1", current: 55, predicted: 50, reorderPoint: 50 },
    { date: "Aug 15", current: null, predicted: 35 },
    { date: "Sep 1", current: null, predicted: 20 },
    { date: "Sep 15", current: null, predicted: 10 }
  ];

  // Use provided data or default
  const chartData = data.length > 0 ? data : defaultData;
  
  // Find the reorder point
  const reorderPoint = chartData.find(item => item.reorderPoint)?.reorderPoint || 0;
  
  // Calculate prediction accuracy
  const getCurrentAndPredictedPairs = chartData.filter(item => item.current !== null && item.predicted !== null);
  let accuracy = 0;
  
  if (getCurrentAndPredictedPairs.length > 0) {
    const totalAccuracy = getCurrentAndPredictedPairs.reduce((acc, item) => {
      const diff = Math.abs(Number(item.current) - Number(item.predicted));
      const percentAccuracy = 100 - (diff / Number(item.current) * 100);
      return acc + percentAccuracy;
    }, 0);
    
    accuracy = totalAccuracy / getCurrentAndPredictedPairs.length;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="text-lg md:text-xl">Inventory Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center">
          <h4 className="text-xs md:text-sm font-medium">
            Prediction Accuracy: {accuracy.toFixed(1)}%
            {accuracy >= 95 ? <ArrowUpIcon className="inline-block h-3 w-3 md:h-4 md:w-4 text-green-500 ml-1 mb-0.5" /> : <ArrowDownIcon className="inline-block h-3 w-3 md:h-4 md:w-4 text-red-500 ml-1 mb-0.5" />}
          </h4>
        </div>
        <div className="h-[200px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
              <Line type="monotone" dataKey="current" stroke="#8884d8" name="Current Inventory" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted Inventory" strokeWidth={2} />
              {reorderPoint > 0 && (
                <ReferenceLine 
                  y={reorderPoint} 
                  stroke="red" 
                  strokeDasharray="3 3" 
                  label={{ 
                    position: 'right', 
                    value: 'Reorder Point', 
                    fill: 'red',
                    fontSize: 10,
                  }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
