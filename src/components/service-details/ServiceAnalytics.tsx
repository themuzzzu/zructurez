
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ServiceAnalyticsProps {
  serviceId: string;
  isOwner: boolean;
}

export const ServiceAnalytics = ({ serviceId, isOwner }: ServiceAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get the user's current plan
  const { data: userPlan, isLoading: isPlanLoading } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      return data;
    },
    enabled: isOwner
  });
  
  // Determine plan level (default to "basic" if no plan is found)
  const planLevel = userPlan?.plan_id || "basic";
  
  // Define which features are available based on plan
  const features = {
    basicAnalytics: true, // Available in all plans
    contactClicks: ["pro", "pro-plus", "master"].includes(planLevel),
    bookings: ["pro", "pro-plus", "master"].includes(planLevel),
    detailedCharts: ["pro-plus", "master"].includes(planLevel),
  };
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch service view data
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('views')
          .eq('id', serviceId)
          .single();
          
        if (serviceError) throw serviceError;
        
        let analyticsData: any = {
          views: serviceData?.views || 0,
          last_updated: new Date().toISOString()
        };
        
        // Only fetch additional data based on plan
        if (features.contactClicks || features.bookings) {
          // Count contact clicks
          if (features.contactClicks) {
            const { data: contactClicksData, error: contactClicksError } = await supabase
              .from('search_result_clicks')
              .select('*')
              .eq('result_id', serviceId);
              
            if (contactClicksError) throw contactClicksError;
            analyticsData.contact_clicks = contactClicksData ? contactClicksData.length : 0;
          }
          
          // Count bookings
          if (features.bookings) {
            const { data: bookingsData, error: bookingsError } = await supabase
              .from('appointments')
              .select('*')
              .eq('service_name', serviceId);
              
            if (bookingsError) throw bookingsError;
            analyticsData.bookings = bookingsData ? bookingsData.length : 0;
          }
        }
        
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOwner) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [serviceId, isOwner, features]);
  
  // If not the owner, don't display analytics
  if (!isOwner) return null;
  
  if (loading || isPlanLoading) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Service Analytics</CardTitle>
          <CardDescription>Loading engagement data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // If analytics data is empty or has all zeroes, show placeholder
  const hasData = analytics && (analytics.views > 0 || 
                              (analytics.bookings && analytics.bookings > 0) || 
                              (analytics.contact_clicks && analytics.contact_clicks > 0));
  
  if (!hasData) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Service Analytics</CardTitle>
          <CardDescription>No engagement data yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Analytics data will appear here as people interact with your service.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const handleUpgradeClick = () => {
    navigate("/settings/pricing");
  };
  
  // Prepare chart data
  const chartData = [
    { name: 'Page Views', value: analytics.views || 0 },
    features.contactClicks && { name: 'Contact Clicks', value: analytics.contact_clicks || 0 },
    features.bookings && { name: 'Bookings', value: analytics.bookings || 0 }
  ].filter(Boolean);
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Service Analytics</CardTitle>
        <CardDescription>
          Engagement metrics for your service listing
          {analytics.last_updated && (
            <span className="block text-xs mt-1">
              Last updated: {new Date(analytics.last_updated).toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold">{analytics.views || 0}</h3>
            <p className="text-sm text-muted-foreground">Page Views</p>
          </div>
          
          {features.contactClicks ? (
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold">{analytics.contact_clicks || 0}</h3>
              <p className="text-sm text-muted-foreground">Contact Clicks</p>
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-lg text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground mb-1" />
                <p className="text-xs font-medium">Pro Plan Required</p>
              </div>
              <h3 className="text-xl font-bold">-</h3>
              <p className="text-sm text-muted-foreground">Contact Clicks</p>
            </div>
          )}
          
          {features.bookings ? (
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold">{analytics.bookings || 0}</h3>
              <p className="text-sm text-muted-foreground">Bookings</p>
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-lg text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground mb-1" />
                <p className="text-xs font-medium">Pro Plan Required</p>
              </div>
              <h3 className="text-xl font-bold">-</h3>
              <p className="text-sm text-muted-foreground">Bookings</p>
            </div>
          )}
        </div>
        
        {features.detailedCharts ? (
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 mt-4 border rounded-lg bg-muted/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold">Detailed Charts</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                Upgrade to Pro+ plan to access detailed analytics charts and visualizations
              </p>
              <Button onClick={handleUpgradeClick}>Upgrade Plan</Button>
            </div>
          </div>
        )}
        
        {planLevel === "basic" && (
          <div className="mt-6 bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div>
                <h4 className="font-medium">Want more insights?</h4>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro or higher to see contact clicks, bookings, and detailed analytics.
                </p>
              </div>
              <Button size="sm" onClick={handleUpgradeClick}>View Plans</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
