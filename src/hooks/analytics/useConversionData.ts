
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ConversionData {
  conversion_rate: number;
  total_views: number;
  total_wishlists: number;
  total_purchases: number;
}

export const useConversionData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['conversion-data', userId],
    queryFn: async (): Promise<ConversionData> => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      try {
        // Get business ID
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (businessError || !businessData) {
          return {
            conversion_rate: 0,
            total_views: 0,
            total_wishlists: 0,
            total_purchases: 0
          };
        }
        
        // Get business analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('business_analytics')
          .select('page_views')
          .eq('business_id', businessData.id)
          .single();
          
        // Get product views
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('views')
          .eq('user_id', userId);
          
        // Get wishlists count
        const { count: wishlistCount, error: wishlistError } = await supabase
          .from('wishlists')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        // Get orders count
        const { count: purchaseCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        // Calculate metrics
        const businessViews = analyticsData?.page_views || 0;
        const productViews = productsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
        const totalViews = businessViews + productViews;
        const totalWishlists = wishlistCount || 0;
        const totalPurchases = purchaseCount || 0;
        
        // Calculate conversion rate (purchases / views)
        // Add a small value to prevent division by zero
        const conversionRate = totalViews > 0 ? totalPurchases / totalViews : 0;
        
        return {
          conversion_rate: conversionRate,
          total_views: totalViews,
          total_wishlists: totalWishlists,
          total_purchases: totalPurchases
        };
      } catch (error) {
        console.error("Error fetching conversion data:", error);
        return {
          conversion_rate: 0,
          total_views: 0,
          total_wishlists: 0,
          total_purchases: 0
        };
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
