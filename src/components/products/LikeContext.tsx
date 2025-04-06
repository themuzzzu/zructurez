
import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LikeContextType {
  isLiked: (productId: string) => boolean;
  toggleLike: (productId: string) => Promise<void>;
  isLoading: boolean;
  likedProducts: Record<string, boolean>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider = ({ children }: { children: ReactNode }) => {
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const isAuthed = !!data.session?.user;
        setIsAuthenticated(isAuthed);
        
        if (isAuthed) {
          // Load all wishlist items
          fetchWishlistItems();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoading(false);
      }
    };
    
    checkAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthed = !!session?.user;
      setIsAuthenticated(isAuthed);
      
      if (isAuthed) {
        fetchWishlistItems();
      } else {
        setLikedProducts({});
        setIsLoading(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch all wishlist items for the current user
  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching wishlist:", error);
        return;
      }
      
      // Create a map of product IDs to liked status
      const likedItems: Record<string, boolean> = {};
      data.forEach(item => {
        likedItems[item.product_id] = true;
      });
      
      console.log("Fetched liked products:", likedItems);
      setLikedProducts(likedItems);
    } catch (error) {
      console.error("Error in fetchWishlistItems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a product is liked
  const isLiked = useCallback((productId: string): boolean => {
    return !!likedProducts[productId];
  }, [likedProducts]);

  // Toggle like status of a product
  const toggleLike = async (productId: string): Promise<void> => {
    // If not authenticated, prompt for login
    if (!isAuthenticated) {
      toast.error("Please sign in to save items to your wishlist", {
        action: {
          label: "Sign In",
          onClick: () => window.location.href = '/auth?redirect=/wishlist'
        },
      });
      throw new Error("Authentication required");
    }
    
    // Prevent double tapping
    if (pendingToggles[productId]) {
      return;
    }
    
    try {
      // Set pending status to prevent duplicate requests
      setPendingToggles(prev => ({ ...prev, [productId]: true }));
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }

      // Optimistic update
      const currentLiked = isLiked(productId);
      setLikedProducts(prev => ({ 
        ...prev,
        [productId]: !currentLiked 
      }));

      if (currentLiked) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) {
          // Revert on error
          setLikedProducts(prev => ({ ...prev, [productId]: true }));
          throw error;
        }
        
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: productId
          });
          
        if (error) {
          // Revert on error
          setLikedProducts(prev => ({ ...prev, [productId]: false }));
          throw error;
        }
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-products'] });
      
    } catch (error) {
      // Error already handled with optimistic updates
      console.error("Error toggling product like:", error);
      throw error;
    } finally {
      setPendingToggles(prev => ({ ...prev, [productId]: false }));
    }
  };

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
