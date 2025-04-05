
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LikeContextType {
  isLiked: (productId: string) => boolean;
  toggleLike: (productId: string) => void;
  isLoading: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider = ({ children }: { children: ReactNode }) => {
  const { wishlistItems, isLoading, isInWishlist, toggleWishlist, loading } = useWishlist();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthChecking(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  // Enhanced toggleLike function that handles authentication
  const handleToggleLike = async (productId: string) => {
    // Check if user is logged in before toggling
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }
    
    // If authenticated, proceed with toggling wishlist item
    toggleWishlist(productId);
  };

  return (
    <LikeContext.Provider 
      value={{ 
        isLiked: isInWishlist, 
        toggleLike: handleToggleLike,
        isLoading: isLoading || loading || isAuthChecking
      }}
    >
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
