import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    description?: string;
    category?: string;
    is_discounted?: boolean;
    discount_percentage?: number;
    original_price?: number;
    views?: number;
    sales_count?: number;
    trending_score?: number;
  };
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/product/${product.id}`);
    }
  };
  
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to add items to wishlist');
      }

      const { data: existingItems, error: checkError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('product_id', product.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItems) {
        const { error: deleteError } = await supabase
          .from('wishlists')
          .delete()
          .eq('id', existingItems.id);
          
        if (deleteError) throw deleteError;
        return { action: 'removed' };
      }

      const { error: insertError } = await supabase
        .from('wishlists')
        .insert({
          user_id: session.session.user.id,
          product_id: product.id
        });

      if (insertError) throw insertError;
      return { action: 'added' };
    },
    onSuccess: (result) => {
      if (result.action === 'added') {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
    onError: (error) => {
      console.error('Error updating wishlist:', error);
      if (error instanceof Error && error.message.includes('logged in')) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update wishlist");
      }
    },
  });
  
  const addToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsAddingToCart(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to add items to your cart");
        return;
      }
      
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1
      });
      
      if (error) throw error;
      toast.success("Product added to cart");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full">
      <div 
        className="aspect-square relative cursor-pointer" 
        onClick={handleClick}
      >
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {product.is_discounted && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {product.discount_percentage}% OFF
          </Badge>
        )}
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 left-2 h-8 w-8 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black text-pink-500 hover:text-pink-600"
          onClick={(e) => {
            e.stopPropagation();
            if (!isAddingToWishlist) {
              setIsAddingToWishlist(true);
              addToWishlistMutation.mutate(undefined, {
                onSettled: () => {
                  setIsAddingToWishlist(false);
                }
              });
            }
          }}
          disabled={isAddingToWishlist}
        >
          <Heart className={`h-4 w-4 ${isAddingToWishlist ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
      
      <div className="p-3 flex flex-col h-[calc(100%-100%)]">
        <h3 className="font-medium text-sm line-clamp-2 flex-grow" title={product.title}>
          {product.title}
        </h3>
        
        <div className="mt-2">
          <div className="flex items-center mb-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">₹{product.price}</span>
            {product.is_discounted && product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.original_price}
              </span>
            )}
          </div>
        </div>
        
        <Button 
          className="w-full mt-2"
          size="sm"
          onClick={addToCart}
          disabled={isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};
