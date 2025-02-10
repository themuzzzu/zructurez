
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsDataPoint {
  date: string;
  views: number;
  products_sold: number;
  bookings: number;
  subscriptions: number;
  revenue: number;
}

export const useBusinessAnalytics = (businessId: string | undefined) => {
  return useQuery<AnalyticsDataPoint[], Error>({
    queryKey: ['business-analytics', businessId],
    enabled: !!businessId,
    queryFn: async () => {
      if (!businessId) throw new Error("Business ID is required");

      // Fetch page views
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('business_analytics')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError);
        throw analyticsError;
      }

      // Fetch orders/products sold
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', businessId);

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Fetch appointments/bookings
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', businessId);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      // Fetch subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('business_memberships')
        .select('*')
        .eq('business_id', businessId);

      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
        throw subscriptionsError;
      }

      // Process and return the combined data
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      return last30Days.map(date => ({
        date,
        views: analyticsData?.page_views || 0,
        products_sold: ordersData?.length || 0,
        bookings: appointmentsData?.length || 0,
        subscriptions: subscriptionsData?.length || 0,
        revenue: (ordersData || []).reduce((sum, order) => sum + (order.total_price || 0), 0)
      }));
    }
  });
};
