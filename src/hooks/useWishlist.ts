
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Fetch the user's wishlist items
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return [];

      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist items');
        return [];
      }

      return data as WishlistItem[];
    },
  });

  // Check if a product is in the wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  // Toggle wishlist status (add or remove)
  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      setLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('You must be logged in to manage wishlist');
      }

      const userId = session.session.user.id;
      
      // Check if product is already in wishlist
      const isAlreadyInWishlist = isInWishlist(productId);
      
      if (isAlreadyInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
          
        if (error) throw error;
        return { added: false, productId };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: userId,
            product_id: productId
          });
          
        if (error) throw error;
        return { added: true, productId };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(result.added 
        ? "Added to wishlist" 
        : "Removed from wishlist");
      setLoading(false);
    },
    onError: (error) => {
      console.error('Error updating wishlist:', error);
      if (error instanceof Error && error.message.includes('logged in')) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update wishlist");
      }
      setLoading(false);
    }
  });

  return {
    wishlistItems,
    isLoading,
    isInWishlist,
    toggleWishlist: (productId: string) => toggleWishlistMutation.mutate(productId),
    loading: loading || toggleWishlistMutation.isPending
  };
};
