
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WishlistPurchaseData {
  wishlist_count: number;
  purchase_count: number;
}

export const useWishlistPurchase = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['wishlist-purchase', userId],
    queryFn: async (): Promise<WishlistPurchaseData> => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      
      try {
        // Get wishlists count
        const { count: wishlistCount, error: wishlistError } = await supabase
          .from('wishlists')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (wishlistError) {
          throw wishlistError;
        }
        
        // Get orders count
        const { count: purchaseCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (ordersError) {
          throw ordersError;
        }
        
        return {
          wishlist_count: wishlistCount || 0,
          purchase_count: purchaseCount || 0
        };
      } catch (error) {
        console.error("Error fetching wishlist-purchase data:", error);
        return {
          wishlist_count: 0,
          purchase_count: 0
        };
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
