
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCardImage } from "./ProductCardImage";
import { ProductCardActions } from "./ProductCardActions";
import { formatPrice } from "@/utils/productUtils";

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
    brand?: string;
  };
  onClick?: () => void;
  layout?: "grid4x4" | "grid2x2" | "grid1x1";
}

export const ProductCard = ({ product, onClick, layout = "grid4x4" }: ProductCardProps) => {
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

  // Generate a rating for display purposes
  const rating = (Math.floor(Math.random() * 15) + 35) / 10; // Random rating between 3.5 and 5.0
  
  if (layout === "grid1x1") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all h-full">
        <div className="flex flex-row w-full" onClick={handleClick}>
          <div className="w-1/3 sm:w-1/4">
            <div className="aspect-square relative">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No image</span>
                </div>
              )}
              {product.is_discounted && product.discount_percentage && (
                <Badge className="absolute top-1 right-1 bg-red-500 text-xs">
                  {product.discount_percentage}% OFF
                </Badge>
              )}
            </div>
          </div>
          
          <div className="w-2/3 sm:w-3/4 p-3">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between">
                  <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlistMutation.mutate();
                    }}
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="flex items-center mt-1 mb-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">({rating.toFixed(1)})</span>
                </div>
                
                <div className="text-xs text-gray-500 line-clamp-1">
                  {product.brand || product.category || "General"}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold">{formatPrice(product.price)}</span>
                  {product.is_discounted && product.original_price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={addToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  const isGrid2x2 = layout === "grid2x2";
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full">
      <div className="relative">
        <div 
          className="aspect-square cursor-pointer" 
          onClick={handleClick}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        {product.is_discounted && product.discount_percentage && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-xs py-0 px-1.5">
            {product.discount_percentage}% OFF
          </Badge>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-7 w-7 bg-white/60 hover:bg-white/80 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            addToWishlistMutation.mutate();
          }}
        >
          <Heart className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className={`p-3 ${isGrid2x2 ? 'p-4' : ''}`} onClick={handleClick}>
        <div className="mb-1">
          <div className="text-xs text-gray-500 mb-1">
            {product.brand || product.category || "General"}
          </div>
          <h3 className={`font-medium line-clamp-1 ${isGrid2x2 ? 'text-base' : 'text-sm'}`}>
            {product.title}
          </h3>
        </div>
        
        <div className="flex items-center mt-1 mb-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">({rating.toFixed(1)})</span>
        </div>
        
        <div className="flex items-baseline gap-1.5 mt-2 mb-2">
          <span className={`font-semibold ${isGrid2x2 ? 'text-lg' : ''}`}>
            {formatPrice(product.price)}
          </span>
          {product.is_discounted && product.original_price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
        
        <Button 
          className="w-full mt-1"
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
