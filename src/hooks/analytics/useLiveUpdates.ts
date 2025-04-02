
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityNotification {
  type: string;
  message: string;
  timestamp: string;
}

export const useLiveUpdates = (userId: string | undefined) => {
  const [newActivity, setNewActivity] = useState<ActivityNotification | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    // Set up a realtime subscription for the business's analytics
    const fetchBusinessId = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (error || !data) {
          console.error("Error fetching business ID:", error);
          return;
        }
        
        const businessId = data.id;
        
        // Subscribe to changes in relevant tables
        const channel = supabase.channel('analytics-updates')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'orders',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              console.log('New order:', payload);
              setNewActivity({
                type: 'purchase',
                message: `New order #${payload.new.id.substring(0, 8)} received`,
                timestamp: new Date().toISOString()
              });
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'business_analytics',
              filter: `business_id=eq.${businessId}`
            },
            (payload) => {
              console.log('Analytics updated:', payload);
              // Check if there's a significant increase in views
              const oldViews = payload.old.page_views || 0;
              const newViews = payload.new.page_views || 0;
              
              if (newViews - oldViews > 10) {
                setNewActivity({
                  type: 'view_spike',
                  message: `Traffic spike: +${newViews - oldViews} views`,
                  timestamp: new Date().toISOString()
                });
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'wishlists',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              console.log('New wishlist item:', payload);
              setNewActivity({
                type: 'wishlist',
                message: 'New item added to wishlist',
                timestamp: new Date().toISOString()
              });
            }
          )
          .subscribe();
          
        // Clean up subscription on unmount
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error setting up real-time updates:", error);
      }
    };
    
    fetchBusinessId();
    
    // Simulate some activity for demo purposes (remove in production)
    const simulateActivity = () => {
      const activities = [
        {
          type: 'purchase',
          message: 'New purchase of ₹1,499 received'
        },
        {
          type: 'view_spike',
          message: 'Traffic spike: +24 views in the last hour'
        },
        {
          type: 'wishlist',
          message: '3 new items added to wishlists'
        }
      ];
      
      // Randomly choose an activity
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      setNewActivity({
        ...randomActivity,
        timestamp: new Date().toISOString()
      });
    };
    
    // In a real app, you wouldn't need this simulation
    // This is just for demo purposes
    const simulationInterval = setInterval(() => {
      // Only simulate with 5% chance every 30 seconds to avoid too many notifications
      if (Math.random() < 0.05) {
        simulateActivity();
      }
    }, 30000);
    
    return () => {
      clearInterval(simulationInterval);
    };
  }, [userId]);
  
  return { newActivity };
};
