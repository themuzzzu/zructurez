
import { useAuth } from "@/hooks/useAuth";
import { useBusinessAnalytics } from "../performance/hooks/useBusinessAnalytics";
import { BusinessAnalyticsCharts } from "../performance/components/BusinessAnalyticsCharts";
import { PerformanceDashboard } from "../performance/PerformanceDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Loader2, Zap, TrendingUp, BarChart, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useState } from "react";
import { AnalyticsSummary } from "@/types/analytics";

// Mock analytics summary data
const mockAnalyticsSummary: AnalyticsSummary = {
  totalViews: 2457,
  totalLikes: 184,
  totalShares: 52,
  totalClicks: 127,
  conversionRate: 3.2,
  period: "Last 30 days"
};

export const AnalyticsTab = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "audience">("overview");
  const { data: businessAnalytics, isLoading, refetch } = useBusinessAnalytics(user?.id);
  const { data: userSubscription } = useUserSubscription();
  
  // Mock data for analytics
  const summary = mockAnalyticsSummary;
  const hasAnalyticsAccess = userSubscription?.analytics_level !== "basic";
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Analytics</h2>
        <p className="text-muted-foreground mb-6">
          Monitor your business performance, audience engagement, and growth trends
        </p>
        
        <div className="flex space-x-2 mb-6">
          <Button 
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === "performance" ? "default" : "outline"}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </Button>
          <Button 
            variant={activeTab === "audience" ? "default" : "outline"}
            onClick={() => setActiveTab("audience")}
          >
            Audience
          </Button>
        </div>
        
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{summary.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>12% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">{summary.totalLikes.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>8.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold">{summary.conversionRate}%</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs flex items-center text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>2.1% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Shares</p>
                      <p className="text-2xl font-bold">{summary.totalShares.toLocaleString()}</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs flex items-center text-red-600">
                    <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                    <span>3.7% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="p-6 mb-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !businessAnalytics ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No analytics data available</p>
                  <p className="text-sm text-muted-foreground mt-2">Analytics data will appear when your business receives views</p>
                </div>
              ) : (
                <BusinessAnalyticsCharts 
                  data={businessAnalytics} 
                  onRefresh={() => refetch()}
                  isLoading={isLoading}
                />
              )}
            </Card>
            
            {!hasAnalyticsAccess && (
              <Card className="border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
                  <CardTitle>Unlock Advanced Analytics</CardTitle>
                  <CardDescription>
                    Upgrade your plan to access advanced analytics features
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                      <Badge variant="outline" className="mb-2">Pro Feature</Badge>
                      <h3 className="text-lg font-medium mb-1">Audience Demographics</h3>
                      <p className="text-sm text-muted-foreground">
                        Understand who's viewing your business profile
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <Badge variant="outline" className="mb-2">Pro Feature</Badge>
                      <h3 className="text-lg font-medium mb-1">Conversion Tracking</h3>
                      <p className="text-sm text-muted-foreground">
                        Track which actions lead to bookings and purchases
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <Badge variant="outline" className="mb-2">Pro Feature</Badge>
                      <h3 className="text-lg font-medium mb-1">Competitor Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        See how you stack up against similar businesses
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Upgrade Now</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {activeTab === "performance" && (
          <Card>
            <CardContent className="p-6">
              <PerformanceDashboard />
            </CardContent>
          </Card>
        )}
        
        {activeTab === "audience" && (
          <Card>
            <CardContent className="p-6 text-center py-12">
              {hasAnalyticsAccess ? (
                <p>Audience analytics features are coming soon!</p>
              ) : (
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">Upgrade to Access Audience Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get detailed insights about your audience demographics, interests, and behavior patterns
                  </p>
                  <Button>Upgrade Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
