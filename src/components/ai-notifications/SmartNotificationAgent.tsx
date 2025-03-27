
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { measureApiCall } from "@/utils/performanceTracking";

interface DynamicAlert {
  id: string;
  type: 'discount' | 'trending' | 'limited-stock' | 'price-drop' | 'new-arrival';
  title: string;
  message: string;
  productId?: string;
  businessId?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt: Date;
}

export const SmartNotificationAgent = () => {
  const { data: currentUser } = useCurrentUser();
  const [lastNotificationTime, setLastNotificationTime] = useState<Date | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const MAX_NOTIFICATIONS = 5;
  
  // Fetch existing notification count on component mount
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotificationCount = async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours
        
      if (!error && count !== null) {
        setNotificationCount(count);
      }
    };
    
    fetchNotificationCount();
  }, [currentUser]);
  
  // Fetch dynamic alerts
  const { data: dynamicAlerts = [] } = useQuery({
    queryKey: ['dynamic-alerts', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      return await measureApiCall('fetch-dynamic-alerts', async () => {
        // This would normally be a more sophisticated algorithm
        // For demo purposes, we'll generate some simulated alerts based on traffic
        
        const alerts: DynamicAlert[] = [];
        
        // 1. Fast-selling products (high traffic + decreasing stock)
        const { data: fastSellingProducts } = await supabase
          .from('products')
          .select('id, title, views, stock, product_purchases(id)')
          .gt('views', 100)  // High traffic
          .lt('stock', 20)   // Limited stock
          .gt('stock', 0)    // Still available
          .order('views', { ascending: false })
          .limit(3);
          
        if (fastSellingProducts && fastSellingProducts.length > 0) {
          const hotProduct = fastSellingProducts[0];
          // Fix: Check if product_purchases is an array before accessing length
          const purchaseCount = Array.isArray(hotProduct.product_purchases) 
            ? hotProduct.product_purchases.length 
            : 0;
          
          if (purchaseCount > 5) { // Only notify for products with real purchase activity
            alerts.push({
              id: `limited-stock-${hotProduct.id}`,
              type: 'limited-stock',
              title: 'Fast-Selling Product Alert',
              message: `"${hotProduct.title}" is selling quickly! Only ${hotProduct.stock} left in stock.`,
              productId: hotProduct.id,
              priority: 'high',
              expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
            });
          }
        }
        
        // 2. High discount products (focus on best deals)
        const { data: discountedProducts } = await supabase
          .from('products')
          .select('id, title, discount_percentage, views')
          .eq('is_discounted', true)
          .gt('discount_percentage', 30) // Significant discount
          .gt('views', 50) // Has some traffic
          .order('discount_percentage', { ascending: false })
          .limit(5);
          
        if (discountedProducts && discountedProducts.length > 0) {
          const bestDeal = discountedProducts[0];
          
          alerts.push({
            id: `discount-${bestDeal.id}`,
            type: 'discount',
            title: 'Big Discount Alert',
            message: `Save ${bestDeal.discount_percentage}% on "${bestDeal.title}"! Limited time offer.`,
            productId: bestDeal.id,
            priority: 'medium',
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
          });
        }
        
        // 3. Trending products (highest traffic)
        const { data: trendingProducts } = await supabase
          .from('products')
          .select('id, title, views')
          .gt('views', 200) // High traffic threshold
          .order('views', { ascending: false })
          .limit(3);
          
        if (trendingProducts && trendingProducts.length > 0) {
          const topProduct = trendingProducts[0];
          
          alerts.push({
            id: `trending-${topProduct.id}`,
            type: 'trending',
            title: 'Trending Now',
            message: `"${topProduct.title}" is trending with over ${topProduct.views} views today!`,
            productId: topProduct.id,
            priority: 'medium',
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
          });
        }
        
        // Sort alerts by priority for intelligent notification delivery
        return alerts.sort((a, b) => {
          const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
      });
    },
    enabled: !!currentUser,
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes to reduce frequency
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
  });
  
  // Show notifications with limits and prioritization
  useEffect(() => {
    if (!dynamicAlerts || dynamicAlerts.length === 0 || !currentUser) return;
    
    const now = new Date();
    const minTimeBetweenNotifications = 4 * 60 * 60 * 1000; // 4 hours between notifications
    
    // Check if we've reached the maximum notifications or if enough time has passed
    if (
      notificationCount >= MAX_NOTIFICATIONS ||
      (lastNotificationTime !== null && 
       now.getTime() - lastNotificationTime.getTime() <= minTimeBetweenNotifications)
    ) {
      return;
    }
    
    // Find the highest priority alert that hasn't expired
    const validAlerts = dynamicAlerts.filter(alert => 
      new Date(alert.expiresAt) > now
    );
    
    if (validAlerts.length > 0) {
      const alert = validAlerts[0];
      
      // Show notification based on the alert type
      switch(alert.type) {
        case 'discount':
          toast({
            title: alert.title,
            description: alert.message,
            action: {
              label: "View Deal",
              onClick: () => {
                if (alert.productId) {
                  window.location.href = `/product/${alert.productId}`;
                }
              }
            },
            duration: 8000,
            priority: 'medium',
            category: 'system'
          });
          break;
          
        case 'trending':
          toast({
            title: alert.title,
            description: alert.message,
            action: {
              label: "See Now",
              onClick: () => {
                if (alert.productId) {
                  window.location.href = `/product/${alert.productId}`;
                }
              }
            },
            duration: 7000,
            priority: 'medium',
            category: 'system'
          });
          break;
          
        case 'limited-stock':
          toast({
            title: alert.title,
            description: alert.message,
            action: {
              label: "Buy Now",
              onClick: () => {
                if (alert.productId) {
                  window.location.href = `/product/${alert.productId}`;
                }
              }
            },
            duration: 10000,
            priority: 'high',
            category: 'system'
          });
          break;
          
        default:
          toast({
            title: alert.title,
            description: alert.message,
            action: {
              label: "Check it out",
              onClick: () => {
                if (alert.productId) {
                  window.location.href = `/product/${alert.productId}`;
                }
              }
            },
            duration: 5000,
            priority: 'low',
            category: 'system'
          });
      }
      
      // Update the last notification time
      setLastNotificationTime(now);
      setNotificationCount(prev => prev + 1);
      
      // Record this notification in the database
      if (currentUser) {
        supabase.from('notifications').insert({
          user_id: currentUser.id,
          message: `${alert.title}: ${alert.message}`,
          read: false
        }).then(({ error }) => {
          if (error) {
            console.error('Error saving notification:', error);
          }
        });
      }
    }
  }, [dynamicAlerts, currentUser, lastNotificationTime, notificationCount]);
  
  // This component doesn't render anything visible, it just manages notifications
  return null;
};
