
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
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
  
  // Fetch dynamic alerts
  const { data: dynamicAlerts = [] } = useQuery({
    queryKey: ['dynamic-alerts', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      return await measureApiCall('fetch-dynamic-alerts', async () => {
        // This would normally be a more sophisticated algorithm
        // For demo purposes, we'll generate some simulated alerts
        
        const alerts: DynamicAlert[] = [];
        
        // 1. Trending products alert
        const { data: trendingProducts } = await supabase
          .from('products')
          .select('id, title, views, product_purchases(id)')
          .order('views', { ascending: false })
          .limit(3);
          
        if (trendingProducts && trendingProducts.length > 0) {
          const topProduct = trendingProducts[0];
          const purchaseCount = topProduct.product_purchases?.length || 0;
          
          alerts.push({
            id: `trending-${topProduct.id}`,
            type: 'trending',
            title: 'Trending Product Alert',
            message: `"${topProduct.title}" is gaining popularity! ${purchaseCount} people purchased it recently.`,
            productId: topProduct.id,
            priority: 'medium',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          });
        }
        
        // 2. Limited stock alert
        const { data: limitedStockProducts } = await supabase
          .from('products')
          .select('id, title, stock')
          .lt('stock', 5) // Low stock
          .gt('stock', 0) // Still available
          .order('stock', { ascending: true })
          .limit(3);
          
        if (limitedStockProducts && limitedStockProducts.length > 0) {
          const lowStockProduct = limitedStockProducts[0];
          
          alerts.push({
            id: `limited-stock-${lowStockProduct.id}`,
            type: 'limited-stock',
            title: 'Limited Stock Alert',
            message: `Only ${lowStockProduct.stock} units left of "${lowStockProduct.title}"! Buy before it's gone.`,
            productId: lowStockProduct.id,
            priority: 'high',
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
          });
        }
        
        // 3. Discount alert
        const { data: discountedProducts } = await supabase
          .from('products')
          .select('id, title, discount_percentage')
          .eq('is_discounted', true)
          .gt('discount_percentage', 20) // Significant discount
          .order('discount_percentage', { ascending: false })
          .limit(5);
          
        if (discountedProducts && discountedProducts.length > 0) {
          const bestDeal = discountedProducts[0];
          
          alerts.push({
            id: `discount-${bestDeal.id}`,
            type: 'discount',
            title: 'Special Discount Alert',
            message: `Grab "${bestDeal.title}" now at ${bestDeal.discount_percentage}% off! Limited time offer.`,
            productId: bestDeal.id,
            priority: 'medium',
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
          });
        }
        
        // 4. New arrivals in preferred categories
        // Get user's preferred categories from purchase history
        const { data: purchaseHistory } = await supabase
          .from('product_purchases')
          .select('product_id')
          .eq('user_id', currentUser.id);
          
        if (purchaseHistory && purchaseHistory.length > 0) {
          const purchasedIds = purchaseHistory.map(item => item.product_id);
          
          const { data: purchasedProducts } = await supabase
            .from('products')
            .select('category')
            .in('id', purchasedIds);
            
          if (purchasedProducts && purchasedProducts.length > 0) {
            const userCategories = [...new Set(purchasedProducts.map(p => p.category))];
            
            if (userCategories.length > 0) {
              // Find newest products in user's preferred categories
              const { data: newArrivals } = await supabase
                .from('products')
                .select('id, title, category')
                .in('category', userCategories)
                .order('created_at', { ascending: false })
                .limit(3);
                
              if (newArrivals && newArrivals.length > 0) {
                const latestProduct = newArrivals[0];
                
                alerts.push({
                  id: `new-arrival-${latestProduct.id}`,
                  type: 'new-arrival',
                  title: 'New Arrival in Your Favorite Category',
                  message: `Check out "${latestProduct.title}" just added to our ${latestProduct.category} collection!`,
                  productId: latestProduct.id,
                  priority: 'low',
                  expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours
                });
              }
            }
          }
        }
        
        // Sort alerts by priority
        return alerts.sort((a, b) => {
          const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
      });
    },
    enabled: !!currentUser,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 3 * 60 * 1000, // Consider data stale after 3 minutes
  });
  
  // Show notifications with a delay to avoid overwhelming the user
  useEffect(() => {
    if (!dynamicAlerts || dynamicAlerts.length === 0 || !currentUser) return;
    
    const now = new Date();
    const minTimeBetweenNotifications = 3 * 60 * 1000; // 3 minutes
    
    // Check if enough time has passed since the last notification
    if (
      lastNotificationTime === null || 
      now.getTime() - lastNotificationTime.getTime() > minTimeBetweenNotifications
    ) {
      // Find the highest priority alert that hasn't expired
      const validAlerts = dynamicAlerts.filter(alert => 
        new Date(alert.expiresAt) > now
      );
      
      if (validAlerts.length > 0) {
        const alert = validAlerts[0];
        
        // Show notification based on the alert type
        switch(alert.type) {
          case 'discount':
            toast(alert.title, {
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
            });
            break;
            
          case 'trending':
            toast(alert.title, {
              description: alert.message,
              action: {
                label: "See Why",
                onClick: () => {
                  if (alert.productId) {
                    window.location.href = `/product/${alert.productId}`;
                  }
                }
              },
              duration: 7000,
            });
            break;
            
          case 'limited-stock':
            toast.warning(alert.title, {
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
            });
            break;
            
          default:
            toast.info(alert.title, {
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
            });
        }
        
        // Update the last notification time
        setLastNotificationTime(now);
        
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
    }
  }, [dynamicAlerts, currentUser, lastNotificationTime]);
  
  // This component doesn't render anything visible, it just manages notifications
  return null;
};
