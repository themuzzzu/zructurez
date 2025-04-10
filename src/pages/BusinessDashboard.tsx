import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowUp,
  ArrowDown,
  BarChart3,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  LineChart,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { ChartContainer } from "@/components/ui/chart";
import { SalesPerformanceChart } from "@/components/dashboard/SalesPerformanceChart";
import { InventoryForecastChart } from "@/components/dashboard/InventoryForecastChart";
import { AIPricingTable } from "@/components/dashboard/AIPricingTable";
import { AdPerformanceTable } from "@/components/dashboard/AdPerformanceTable";
import { RealtimeOrdersTable } from "@/components/dashboard/RealtimeOrdersTable";
import { PerformanceMetricsCards } from "@/components/dashboard/PerformanceMetricsCards";
import { UpgradeAIFeaturesCard } from "@/components/dashboard/UpgradeAIFeaturesCard";
import { useBusinessAnalytics } from "@/components/performance/hooks/useBusinessAnalytics";
import { BusinessAnalyticsCharts } from "@/components/performance/components/BusinessAnalyticsCharts";
import { BusinessBookingsTimeline } from "@/components/bookings/BusinessBookingsTimeline";

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: businessData, isLoading: businessLoading, refetch: refetchBusiness } = useQuery({
    queryKey: ['user-businesses', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  
  const { data: salesData, isLoading: salesLoading, refetch: refetchSales } = useQuery({
    queryKey: ['business-sales', businessData?.id, dateRange],
    queryFn: async () => {
      if (!businessData?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(*)')
        .eq('business_id', businessData.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!businessData?.id
  });
  
  const { data: adData, isLoading: adLoading, refetch: refetchAds } = useQuery({
    queryKey: ['business-ads', businessData?.id],
    queryFn: async () => {
      if (!businessData?.id) return [];
      
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('business_id', businessData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!businessData?.id
  });
  
  const { data: inventoryData, isLoading: inventoryLoading, refetch: refetchInventory } = useQuery({
    queryKey: ['business-inventory', businessData?.id],
    queryFn: async () => {
      if (!businessData?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('stock', { ascending: true });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!businessData?.id && !!user?.id
  });
  
  const { data: businessAnalytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useBusinessAnalytics(user?.id);
  
  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchBusiness(),
      refetchSales(),
      refetchAds(),
      refetchInventory(),
      refetchAnalytics()
    ]);
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  };
  
  const totalSales = salesData?.reduce((sum, order) => sum + order.total_price, 0) || 0;
  const totalOrders = salesData?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const lowStockItems = inventoryData?.filter(product => product.stock < 5).length || 0;
  
  const totalImpressions = adData?.reduce((sum, ad) => sum + (ad.reach || 0), 0) || 0;
  const totalClicks = adData?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0;
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : "0";
  
  return (
    <div className="container py-6 max-w-7xl mx-auto px-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <p className="text-muted-foreground">
            {businessLoading ? "Loading business data..." : 
             businessData ? `Analytics for ${businessData.name}` : 
             "No business found. Please create a business first."}
          </p>
        </div>
        
        <Button 
          onClick={refreshData} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {!businessData && !businessLoading ? (
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">No Business Found</h2>
            <p className="text-muted-foreground mb-6">Create a business to view your analytics dashboard</p>
            <Button>Create Business</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
              <CardDescription>
                Manage your customer appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {businessData?.id && (
                <BusinessBookingsTimeline businessId={businessData.id} />
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Business Analytics</CardTitle>
              <CardDescription>
                Track views, engagement and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !businessAnalytics ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No analytics data available</p>
                </div>
              ) : (
                <BusinessAnalyticsCharts 
                  data={businessAnalytics} 
                  onRefresh={refetchAnalytics}
                  isLoading={analyticsLoading}
                />
              )}
            </CardContent>
          </Card>
          
          <PerformanceMetricsCards 
            totalSales={totalSales}
            totalOrders={totalOrders}
            averageOrderValue={averageOrderValue}
            lowStockItems={lowStockItems}
            totalImpressions={totalImpressions}
            totalClicks={totalClicks}
            averageCTR={averageCTR}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Track your revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <div className="flex space-x-2">
                    {["daily", "weekly", "monthly", "yearly"].map((range) => (
                      <Button 
                        key={range}
                        variant={dateRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateRange(range as any)}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px]">
                  <SalesPerformanceChart 
                    salesData={salesData || []} 
                    isLoading={salesLoading} 
                    dateRange={dateRange}
                  />
                </div>
              </CardContent>
            </Card>
            
            <UpgradeAIFeaturesCard />
          </div>
          
          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList className="overflow-x-auto whitespace-nowrap w-full border-b scrollbar-hide">
              <TabsTrigger value="sales" className="inline-flex">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sales
              </TabsTrigger>
              <TabsTrigger value="bookings" className="inline-flex">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="inventory" className="inline-flex">
                <BarChart3 className="h-4 w-4 mr-2" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="ads" className="inline-flex">
                <Target className="h-4 w-4 mr-2" />
                Ads
              </TabsTrigger>
              <TabsTrigger value="pricing" className="inline-flex">
                <DollarSign className="h-4 w-4 mr-2" />
                AI Pricing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>View and manage your latest orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <RealtimeOrdersTable 
                    salesData={salesData || []} 
                    isLoading={salesLoading} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Management</CardTitle>
                  <CardDescription>View and manage customer bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {businessData?.id && (
                    <BusinessBookingsTimeline businessId={businessData.id} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inventory">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Stock levels and reorder suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inventoryLoading ? (
                        <p>Loading inventory data...</p>
                      ) : (
                        <div className="space-y-4">
                          {(inventoryData || []).map(product => (
                            <div key={product.id} className="flex justify-between items-center p-3 border rounded-md">
                              <div>
                                <div className="font-medium">{product.title}</div>
                                <div className="text-sm text-muted-foreground">SKU: {product.id.substring(0, 8)}</div>
                              </div>
                              <div className="flex items-center">
                                <div className={`font-medium text-sm mr-3 ${
                                  product.stock <= 3 ? 'text-red-500' : 
                                  product.stock <= 10 ? 'text-amber-500' : 'text-green-500'
                                }`}>
                                  {product.stock} in stock
                                </div>
                                {product.stock <= 5 && (
                                  <Button size="sm" variant="outline">Restock</Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Stock Forecasting</CardTitle>
                    <CardDescription>Predictive inventory management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <InventoryForecastChart 
                        inventoryData={inventoryData || []} 
                        isLoading={inventoryLoading} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="ads">
              <Card>
                <CardHeader>
                  <CardTitle>Ad Performance</CardTitle>
                  <CardDescription>Track ROI and engagement for your campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdPerformanceTable adData={adData || []} isLoading={adLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>AI Pricing Recommendations</CardTitle>
                  <CardDescription>Smart price optimization to maximize revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <AIPricingTable inventoryData={inventoryData || []} isLoading={inventoryLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default BusinessDashboard;
