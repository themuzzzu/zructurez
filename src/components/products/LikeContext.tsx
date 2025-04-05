
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LikeContextType {
  isLiked: (productId: string) => boolean;
  toggleLike: (productId: string) => Promise<void>;
  isLoading: boolean;
  likedProducts: Record<string, boolean>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider = ({ children }: { children: ReactNode }) => {
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isLiked = useCallback((productId: string) => {
    return !!likedProducts[productId];
  }, [likedProducts]);

  const toggleLike = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      // Get current user session
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user) {
        toast.error("Please sign in to add items to your wishlist");
        return;
      }

      const userId = data.session.user.id;
      const currentlyLiked = likedProducts[productId];

      if (currentlyLiked) {
        // Remove from wishlist
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        setLikedProducts((prev) => ({
          ...prev,
          [productId]: false,
        }));
      } else {
        // Add to wishlist
        await supabase
          .from('wishlists')
          .insert({
            user_id: userId,
            product_id: productId,
            created_at: new Date().toISOString(),
          });

        setLikedProducts((prev) => ({
          ...prev,
          [productId]: true,
        }));
      }
    } catch (error) {
      console.error("Error toggling wishlist item:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [likedProducts]);

  return (
    <LikeContext.Provider value={{ isLiked, toggleLike, isLoading, likedProducts }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error("useLike must be used within a LikeProvider");
  }
  return context;
};
