
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
      
      // Simple algorithm to generate alerts based on product data
      const alerts: DynamicAlert[] = [];
      
      // 1. Fast-selling products (limited stock)
      const { data: fastSellingProducts } = await supabase
        .from('products')
        .select('id, title, views, stock')
        .gt('views', 100)  // High traffic
        .lt('stock', 20)   // Limited stock
        .gt('stock', 0)    // Still available
        .order('views', { ascending: false })
        .limit(3);
          
      if (fastSellingProducts && fastSellingProducts.length > 0) {
        const hotProduct = fastSellingProducts[0];
        
        alerts.push({
          id: `limited-stock-${hotProduct.id}`,
          type: 'limited-stock',
          title: 'Limited Stock Alert',
          message: `"${hotProduct.title}" is selling quickly! Only ${hotProduct.stock} left in stock.`,
          productId: hotProduct.id,
          priority: 'high',
          expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
        });
      }
      
      // 2. Discounted products
      const { data: discountedProducts } = await supabase
        .from('products')
        .select('id, title, discount_percentage')
        .eq('is_discounted', true)
        .gt('discount_percentage', 30) // Significant discount
        .order('discount_percentage', { ascending: false })
        .limit(5);
          
      if (discountedProducts && discountedProducts.length > 0) {
        const bestDeal = discountedProducts[0];
        
        alerts.push({
          id: `discount-${bestDeal.id}`,
          type: 'discount',
          title: 'Special Discount',
          message: `Save ${bestDeal.discount_percentage}% on "${bestDeal.title}"!`,
          productId: bestDeal.id,
          priority: 'medium',
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
        });
      }
      
      // 3. Trending products
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
          message: `"${topProduct.title}" is trending with shoppers today!`,
          productId: topProduct.id,
          priority: 'medium',
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
        });
      }
      
      // Sort alerts by priority
      return alerts.sort((a, b) => {
        const priorityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
    },
    enabled: !!currentUser,
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
  });
  
  return { dynamicAlerts };
};

export type { DynamicAlert };
