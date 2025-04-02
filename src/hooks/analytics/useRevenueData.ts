
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Helper function to generate date ranges for revenue
const generateDateRange = (days: number) => {
  const result = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.unshift({
      date: date.toISOString().split('T')[0],
      revenue: 0,
      projected: 0
    });
  }
  return result;
};

export const useRevenueData = (userId: string | undefined, timeRange: string) => {
  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  
  return useQuery({
    queryKey: ['revenue-data', userId, timeRange],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      try {
        // Create a date range array as template
        const dateRange = generateDateRange(days);
        
        // Get orders by date
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('total_price, created_at')
          .eq('user_id', userId);
          
        if (ordersError) throw ordersError;
        
        // Process the data to match our date range format
        const processedData = dateRange.map(item => {
          const date = item.date;
          
          // Sum order total prices for this date
          const dateRevenue = ordersData?.filter(o => 
            o.created_at && o.created_at.startsWith(date)
          ).reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
          
          // Create a projected revenue (30% higher than actual in this mock)
          const projectedRevenue = dateRevenue * 1.3;
          
          return {
            date,
            revenue: dateRevenue,
            projected: projectedRevenue
          };
        });
        
        return processedData;
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        return generateDateRange(days); // Return empty template on error
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
