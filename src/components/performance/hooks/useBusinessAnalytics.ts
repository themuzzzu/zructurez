
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

      // First, get analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('business_analytics')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError);
        throw analyticsError;
      }

      // Get orders linked to this business
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', businessId);

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Get appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', businessId);

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      // Get subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('business_memberships')
        .select('*')
        .eq('business_id', businessId);

      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
        throw subscriptionsError;
      }

      // Create data points for the last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      return last30Days.map(date => {
        // Filter data for this specific date
        const dateOrders = (ordersData || []).filter(order => 
          order.created_at.split('T')[0] === date
        );
        const dateAppointments = (appointmentsData || []).filter(appointment => 
          appointment.created_at.split('T')[0] === date
        );
        const dateSubscriptions = (subscriptionsData || []).filter(subscription => 
          subscription.created_at.split('T')[0] === date
        );

        return {
          date,
          views: analyticsData?.page_views || 0,
          products_sold: dateOrders.length,
          bookings: dateAppointments.length,
          subscriptions: dateSubscriptions.length,
          revenue: dateOrders.reduce((sum, order) => sum + (order.total_price || 0), 0)
        };
      });
    }
  });
};
