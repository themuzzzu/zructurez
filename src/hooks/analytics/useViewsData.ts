
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Helper function to generate date ranges
const generateDateRange = (days: number) => {
  const result = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.unshift({
      date: date.toISOString().split('T')[0],
      views: 0,
      wishlists: 0
    });
  }
  return result;
};

export const useViewsData = (userId: string | undefined, timeRange: string) => {
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  
  return useQuery({
    queryKey: ['views-data', userId, timeRange],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      try {
        // Create a date range array as template
        const dateRange = generateDateRange(days);
        
        // Get business ID
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (businessError || !businessData) {
          return dateRange; // Return empty template if no business found
        }
        
        // Get product views by date
        // This is a mock implementation - in a real app, you would query a views table with timestamps
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('views, created_at')
          .eq('user_id', userId);
          
        if (productsError) throw productsError;
        
        // Get wishlists by date
        const { data: wishlistsData, error: wishlistsError } = await supabase
          .from('wishlists')
          .select('created_at')
          .eq('user_id', userId);
          
        if (wishlistsError) throw wishlistsError;
        
        // Process the data to match our date range format
        // This is simplified - in a real app, you would aggregate by date properly
        const processedData = dateRange.map(item => {
          const date = item.date;
          
          // Count products created/viewed on this date
          const dateViews = productsData?.filter(p => 
            p.created_at && p.created_at.startsWith(date)
          ).reduce((sum, p) => sum + (p.views || 0), 0) || 0;
          
          // Count wishlists created on this date
          const dateWishlists = wishlistsData?.filter(w => 
            w.created_at && w.created_at.startsWith(date)
          ).length || 0;
          
          return {
            date,
            views: dateViews,
            wishlists: dateWishlists
          };
        });
        
        return processedData;
      } catch (error) {
        console.error("Error fetching views data:", error);
        return generateDateRange(days); // Return empty template on error
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
