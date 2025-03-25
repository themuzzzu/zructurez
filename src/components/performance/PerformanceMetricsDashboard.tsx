
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { usePerformanceMetrics } from "./hooks/usePerformanceMetrics";
import { ResponseTimeChart } from "./components/ResponseTimeChart";
import { SlowApiCallsTable } from "./components/SlowApiCallsTable";
import { getMemoryUsage, simulateLoad } from "@/utils/performanceTracking";
import { Button } from "@/components/ui/button";
import { Activity, Cpu, Database, LineChart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const PerformanceMetricsDashboard = () => {
  const { combinedData, isLoading } = usePerformanceMetrics();
  const [currentMemory, setCurrentMemory] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Update memory usage periodically
  useEffect(() => {
    const updateMemory = () => {
      const usage = getMemoryUsage();
      setCurrentMemory(usage);
    };

    // Initial update
    updateMemory();

    // Set interval to update every 3 seconds
    const intervalId = setInterval(updateMemory, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSimulateLoad = async (userCount: number) => {
    setIsSimulating(true);
    toast.info(`Simulating load with ${userCount} concurrent users...`);
    
    try {
      await simulateLoad(userCount);
      toast.success(`Load test with ${userCount} users completed successfully`);
    } catch (error) {
      toast.error(`Load test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // Get performance status based on metrics
  const getPerformanceStatus = () => {
    const slowApis = combinedData.filter(d => d.response_time > 500).length;
    
    if (slowApis > 5 || (currentMemory && currentMemory > 80)) {
      return { label: "Issues Detected", color: "destructive" };
    } else if (slowApis > 0 || (currentMemory && currentMemory > 60)) {
      return { label: "Acceptable", color: "warning" };
    } else {
      return { label: "Excellent", color: "success" };
    }
  };

  const status = getPerformanceStatus();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">Monitor application performance metrics</p>
        </div>
        <Badge variant={status.color as any}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
            <CardDescription className="text-xs">Average across all endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {isLoading ? (
                  "..."
                ) : (
                  combinedData.length > 0 
                    ? `${(combinedData.reduce((sum, item) => sum + item.response_time, 0) / combinedData.length).toFixed(0)}ms`
                    : "N/A"
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <CardDescription className="text-xs">Current heap usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Cpu className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {currentMemory !== null ? `${currentMemory.toFixed(1)}%` : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Ratio</CardTitle>
            <CardDescription className="text-xs">Memory & API cache efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {isLoading ? "..." : "78.4%"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Slow Requests</CardTitle>
            <CardDescription className="text-xs">Requests over 500ms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : combinedData.filter(item => item.response_time > 500).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="slow-calls">Slow API Calls</TabsTrigger>
          <TabsTrigger value="load-test">Load Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <ResponseTimeChart data={combinedData} />
        </TabsContent>
        
        <TabsContent value="slow-calls">
          <SlowApiCallsTable data={combinedData} />
        </TabsContent>
        
        <TabsContent value="load-test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Load Testing</CardTitle>
              <CardDescription>
                Simulate multiple concurrent users to test application performance under load
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleSimulateLoad(10)}
                  disabled={isSimulating}
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  10 Users
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSimulateLoad(50)}
                  disabled={isSimulating}
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  50 Users
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSimulateLoad(100)}
                  disabled={isSimulating}
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  100 Users
                </Button>
              </div>
              
              {isSimulating && (
                <div className="text-center py-4 text-muted-foreground">
                  <div className="animate-pulse">Running simulation...</div>
                  <p className="text-xs mt-1">This may take a few moments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
