
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsSummary {
  totalViews: number;
  totalWishlists: number;
  totalPurchases: number;
  projectedRevenue: number;
}

export const useAnalyticsSummary = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['analytics-summary', userId],
    queryFn: async (): Promise<AnalyticsSummary> => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      try {
        // Get business ID for the user
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (businessError || !businessData) {
          throw new Error("Business not found");
        }
        
        // Get business analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('business_analytics')
          .select('page_views')
          .eq('business_id', businessData.id)
          .single();
          
        // Get product views
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('views')
          .eq('user_id', userId);
          
        // Get wishlists count
        const { count: wishlistCount, error: wishlistError } = await supabase
          .from('wishlists')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        // Get orders count
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_price')
          .eq('user_id', userId);
          
        // Calculate total metrics
        const businessViews = analyticsData?.page_views || 0;
        const productViews = productData?.reduce((sum, product) => sum + (product.views || 0), 0) || 0;
        const totalViews = businessViews + productViews;
        const totalWishlists = wishlistCount || 0;
        const totalPurchases = ordersData?.length || 0;
        
        // Calculate projected revenue (actual revenue + estimate from wishlists)
        const actualRevenue = ordersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
        const wishlistConversionRate = 0.15; // Assume 15% of wishlists convert to purchases
        const avgOrderValue = totalPurchases > 0 ? actualRevenue / totalPurchases : 0;
        const projectedAdditionalRevenue = (totalWishlists * wishlistConversionRate * avgOrderValue);
        const projectedRevenue = actualRevenue + projectedAdditionalRevenue;
        
        return {
          totalViews,
          totalWishlists,
          totalPurchases,
          projectedRevenue
        };
      } catch (error) {
        console.error("Error fetching analytics summary:", error);
        // Return default values in case of error
        return {
          totalViews: 0,
          totalWishlists: 0,
          totalPurchases: 0,
          projectedRevenue: 0
        };
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
