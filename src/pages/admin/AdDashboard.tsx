
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Advertisement, AdType } from "@/services/adService";
import { AdPerformanceChart } from "@/components/admin/AdPerformanceChart";
import { AdManagementTable } from "@/components/admin/AdManagementTable";
import { RevenueOverview } from "@/components/admin/RevenueOverview";
import { ProductInsightsTable } from "@/components/admin/ProductInsightsTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AdSlotManager } from "@/components/admin/AdSlotManager";

const AdDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adTypeFilter, setAdTypeFilter] = useState<AdType | "all">("all");
  const [adminTab, setAdminTab] = useState("management");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch all ads for admin
  const { data: ads = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-ads'],
    queryFn: async () => {
      // Check if user has admin role (in a real app, this would be a proper RBAC check)
      const isAdmin = true; // TODO: implement proper role check
      
      if (!isAdmin) {
        throw new Error("Unauthorized access");
      }
      
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error("Failed to load advertisements");
        throw error;
      }
      
      return data as Advertisement[];
    }
  });
  
  // Filter ads based on selected type
  const filteredAds = adTypeFilter === "all" 
    ? ads 
    : ads.filter(ad => ad.type === adTypeFilter);
  
  // Stats calculations
  const pendingAdsCount = ads.filter(ad => ad.status === "pending").length;
  const activeAdsCount = ads.filter(ad => ad.status === "active").length;
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.reach || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
  const averageCTR = totalImpressions > 0 
    ? ((totalClicks / totalImpressions) * 100).toFixed(2) 
    : "0";
  
  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Ads & Monetization Dashboard</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{pendingAdsCount}</div>
            <p className="text-muted-foreground">Pending Ads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeAdsCount}</div>
            <p className="text-muted-foreground">Active Ads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-muted-foreground">Total Impressions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{averageCTR}%</div>
            <p className="text-muted-foreground">Average CTR</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={adminTab} onValueChange={setAdminTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="management">Ad Management</TabsTrigger>
          <TabsTrigger value="slots">Ad Slots</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Payments</TabsTrigger>
          <TabsTrigger value="products">Product Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ad Management</CardTitle>
              <CardDescription>Approve, reject, and manage advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant={adTypeFilter === "all" ? "default" : "outline"} 
                    onClick={() => setAdTypeFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button 
                    variant={adTypeFilter === "business" ? "default" : "outline"} 
                    onClick={() => setAdTypeFilter("business")}
                    size="sm"
                  >
                    Business
                  </Button>
                  <Button 
                    variant={adTypeFilter === "service" ? "default" : "outline"} 
                    onClick={() => setAdTypeFilter("service")}
                    size="sm"
                  >
                    Service
                  </Button>
                  <Button 
                    variant={adTypeFilter === "product" ? "default" : "outline"} 
                    onClick={() => setAdTypeFilter("product")}
                    size="sm"
                  >
                    Product
                  </Button>
                  <Button 
                    variant={adTypeFilter === "sponsored" ? "default" : "outline"} 
                    onClick={() => setAdTypeFilter("sponsored")}
                    size="sm"
                  >
                    Sponsored
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
              <AdManagementTable ads={filteredAds} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="slots" className="space-y-4">
          <AdSlotManager />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track ad impressions, clicks, and conversions</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <AdPerformanceChart data={ads} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monitor ad revenue and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueOverview ads={ads} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Insights</CardTitle>
              <CardDescription>Analyze product performance and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductInsightsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdDashboard;
