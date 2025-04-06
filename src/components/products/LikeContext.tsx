
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface LikeContextType {
  likes: string[];
  isLiked: (productId: string) => boolean;
  toggleLike: (productId: string) => void;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLoading: boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likes, setLikes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load liked products from localStorage on mount
  useEffect(() => {
    const storedLikes = localStorage.getItem('likedProducts');
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    }
    
    // If user is logged in, also fetch from database
    if (user) {
      fetchWishlist();
    }
  }, [user]);
  
  // Fetch user's wishlist from database
  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const wishlistIds = data.map(item => item.product_id);
        // Merge with local likes and deduplicate
        const mergedLikes = Array.from(new Set([...likes, ...wishlistIds]));
        setLikes(mergedLikes);
        localStorage.setItem('likedProducts', JSON.stringify(mergedLikes));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if a product is liked
  const isLiked = (productId: string) => {
    return likes.includes(productId);
  };
  
  // Add a product to wishlist in database
  const addToWishlist = async (productId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId });
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Failed to save",
        description: "Could not add to your wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove a product from wishlist in database
  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Failed to remove",
        description: "Could not remove from your wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle like status of a product
  const toggleLike = (productId: string) => {
    let updatedLikes: string[];
    
    if (likes.includes(productId)) {
      updatedLikes = likes.filter(id => id !== productId);
      if (user) {
        removeFromWishlist(productId);
      }
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist."
      });
    } else {
      updatedLikes = [...likes, productId];
      if (user) {
        addToWishlist(productId);
      }
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist."
      });
    }
    
    setLikes(updatedLikes);
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
  };
  
  return (
    <LikeContext.Provider value={{ 
      likes, 
      isLiked, 
      toggleLike,
      addToWishlist,
      removeFromWishlist,
      isLoading
    }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikeProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useLikeContext = useLikes;
