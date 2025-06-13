
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Users, Shield, DollarSign, BarChart3, AlertTriangle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

// Import existing components
import { AdManagementTable } from "@/components/admin/AdManagementTable";
import { AdPerformanceChart } from "@/components/admin/AdPerformanceChart";
import { RevenueOverview } from "@/components/admin/RevenueOverview";
import { ProductInsightsTable } from "@/components/admin/ProductInsightsTable";
import { AdSlotManager } from "@/components/admin/AdSlotManager";

// Import new modules
import { UserManagementModule } from "@/components/admin/UserManagementModule";
import { ContentModerationModule } from "@/components/admin/ContentModerationModule";

// Import services
import { isUserAdmin, getSystemMetrics, getRevenueAnalytics } from "@/services/adminService";
import { fetchUserAds } from "@/services/adService";

const EnhancedAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user is admin
  const { data: isAdmin, isLoading: adminCheckLoading } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: () => isUserAdmin(user?.id),
    enabled: !!user?.id
  });

  // Fetch dashboard data
  const { data: ads = [], refetch: refetchAds } = useQuery({
    queryKey: ['admin-ads'],
    queryFn: () => fetchUserAds(user?.id || ''),
    enabled: !!user?.id && isAdmin
  });

  const { data: systemMetrics = [] } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: () => getSystemMetrics(['active_users', 'daily_signups', 'content_reports']),
    enabled: isAdmin
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: () => getRevenueAnalytics({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    }),
    enabled: isAdmin
  });

  if (loading || adminCheckLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Shield className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchAds()]);
    setIsRefreshing(false);
    toast.success("Dashboard data refreshed");
  };

  // Calculate overview stats
  const activeAds = ads.filter(ad => ad.status === 'active').length;
  const pendingAds = ads.filter(ad => ad.status === 'pending').length;
  const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
  const totalRevenue = revenueData?.totalRevenue || 0;

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Enhanced Admin Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive platform management</p>
          </div>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Ads
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Finance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{activeAds}</div>
                    <div className="text-sm text-muted-foreground">Active Ads</div>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{pendingAds}</div>
                    <div className="text-sm text-muted-foreground">Pending Review</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Impressions</div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Revenue (30d)</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">New</Badge>
                    <span className="text-sm">User registered: user@example.com</span>
                    <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Review</Badge>
                    <span className="text-sm">Content flagged for moderation</span>
                    <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Payment</Badge>
                    <span className="text-sm">Ad payment received: $50.00</span>
                    <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="success">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <Badge variant="success">95ms avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Error Rate</span>
                    <Badge variant="success">0.1%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Users</span>
                    <Badge variant="secondary">1,234</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagementModule />
        </TabsContent>

        <TabsContent value="moderation">
          <ContentModerationModule />
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AdManagementTable ads={ads} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueOverview ads={ads} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <AdPerformanceChart data={ads} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductInsightsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AdSlotManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminDashboard;
