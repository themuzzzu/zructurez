
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
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

export const useAlertData = () => {
  const { data: currentUser } = useCurrentUser();
  
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
  
  return { dynamicAlerts };
};

export type { DynamicAlert };
