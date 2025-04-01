
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useWishlist } from "@/hooks/useWishlist";

interface LikeContextType {
  isLiked: (productId: string) => boolean;
  toggleLike: (productId: string) => void;
  isLoading: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider = ({ children }: { children: ReactNode }) => {
  const { wishlistItems, isLoading, isInWishlist, toggleWishlist, loading } = useWishlist();

  return (
    <LikeContext.Provider 
      value={{ 
        isLiked: isInWishlist, 
        toggleLike: toggleWishlist,
        isLoading: isLoading || loading
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
