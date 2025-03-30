
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ServiceAnalyticsProps {
  serviceId: string;
  isOwner: boolean;
}

export const ServiceAnalytics = ({ serviceId, isOwner }: ServiceAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
        
        // Count contact clicks and bookings
        const { data: contactClicksData, error: contactClicksError } = await supabase
          .from('search_result_clicks')
          .select('*', { count: 'exact' })
          .eq('result_id', serviceId);
          
        if (contactClicksError) throw contactClicksError;
        
        const contactClicks = contactClicksData ? contactClicksData.length : 0;
        
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact' })
          .eq('service_name', serviceId);
          
        if (bookingsError) throw bookingsError;
        
        const bookings = bookingsData ? bookingsData.length : 0;
        
        setAnalytics({
          views: serviceData?.views || 0,
          contact_clicks: contactClicks || 0,
          bookings: bookings || 0,
          last_updated: new Date().toISOString()
        });
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
  }, [serviceId, isOwner]);
  
  // If not the owner, don't display analytics
  if (!isOwner) return null;
  
  if (loading) {
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
  const hasData = analytics && (analytics.views > 0 || analytics.bookings > 0 || analytics.contact_clicks > 0);
  
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
  
  // Prepare chart data
  const chartData = [
    { name: 'Page Views', value: analytics.views || 0 },
    { name: 'Contact Clicks', value: analytics.contact_clicks || 0 },
    { name: 'Bookings', value: analytics.bookings || 0 }
  ];
  
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
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold">{analytics.contact_clicks || 0}</h3>
            <p className="text-sm text-muted-foreground">Contact Clicks</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <h3 className="text-xl font-bold">{analytics.bookings || 0}</h3>
            <p className="text-sm text-muted-foreground">Bookings</p>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
};
