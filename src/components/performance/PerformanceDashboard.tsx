
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { simulateLoad, getMemoryUsage } from "@/utils/performanceTracking";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar } from "recharts";
import { Loader2 } from "lucide-react";

export const PerformanceDashboard = () => {
  const [userCount, setUserCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  
  const performanceData = [
    { name: "Page Load", time: 1200 },
    { name: "API Call", time: 350 },
    { name: "Render", time: 180 },
    { name: "Database", time: 290 },
    { name: "Auth", time: 150 },
  ];
  
  const handleLoadTest = async () => {
    setIsLoading(true);
    try {
      await simulateLoad(userCount);
      const currentMemory = getMemoryUsage();
      setMemoryUsage(currentMemory);
    } catch (error) {
      console.error("Load test failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="time" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-3">
                <p className="text-sm font-medium">Memory Usage</p>
                <p className="text-2xl font-bold">
                  {memoryUsage !== null ? `${memoryUsage.toFixed(1)}%` : "N/A"}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-2xl font-bold">238ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Load Testing</CardTitle>
            <CardDescription>Simulate multiple concurrent users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="userCount">Number of Users</Label>
                <Input
                  id="userCount"
                  type="number"
                  value={userCount}
                  onChange={(e) => setUserCount(parseInt(e.target.value) || 1)}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleLoadTest} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Running Test..." : "Run Load Test"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Historical data on system performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { day: "Mon", responseTime: 320, errorRate: 2 },
                  { day: "Tue", responseTime: 380, errorRate: 1 },
                  { day: "Wed", responseTime: 420, errorRate: 5 },
                  { day: "Thu", responseTime: 290, errorRate: 3 },
                  { day: "Fri", responseTime: 340, errorRate: 0 },
                  { day: "Sat", responseTime: 290, errorRate: 1 },
                  { day: "Sun", responseTime: 270, errorRate: 0 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Error Rate (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
