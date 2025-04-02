
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock data generator for engagement heatmap
const generateEngagementHeatmap = () => {
  return Array.from({ length: 24 }, (_, i) => {
    // Create a pattern: more activity during business hours, peak at lunch and evening
    let baseEngagement = 20; 
    
    // Early morning (0-6): low activity
    if (i >= 0 && i < 6) {
      baseEngagement = 5 + Math.floor(Math.random() * 10);
    } 
    // Morning (6-11): medium activity
    else if (i >= 6 && i < 11) {
      baseEngagement = 20 + Math.floor(Math.random() * 20);
    }
    // Lunchtime (11-14): high activity
    else if (i >= 11 && i < 14) {
      baseEngagement = 50 + Math.floor(Math.random() * 30);
    }
    // Afternoon (14-17): medium-high activity
    else if (i >= 14 && i < 17) {
      baseEngagement = 30 + Math.floor(Math.random() * 20);
    }
    // Evening (17-22): very high activity
    else if (i >= 17 && i < 22) {
      baseEngagement = 60 + Math.floor(Math.random() * 30);
    }
    // Late night (22-24): declining activity
    else {
      baseEngagement = 15 + Math.floor(Math.random() * 15);
    }
    
    return {
      hour: `${i}`,
      engagement: baseEngagement
    };
  });
};

export const useEngagementData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['engagement-data', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      try {
        // In a real implementation, you would fetch actual hourly engagement data
        // For now, we're returning simulated data for the engagement heatmap
        
        // Get business ID
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (businessError || !businessData) {
          return generateEngagementHeatmap(); // Return mock data if no business found
        }
        
        // Get actual business analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('business_analytics')
          .select('*')
          .eq('business_id', businessData.id)
          .single();
          
        // For now, just return simulated engagement data
        // In a real app, you would process the analytics data to extract hourly patterns
        return generateEngagementHeatmap();
      } catch (error) {
        console.error("Error fetching engagement data:", error);
        return generateEngagementHeatmap(); // Return mock data on error
      }
    },
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
