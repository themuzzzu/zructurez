
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/utils/productUtils";
import { ProductType } from "./types/ProductTypes";
import { Product } from "@/types/product";
import { ProductLikeButton } from "./ProductLikeButton";

interface ProductCardCompactProps {
  product: Product | ProductType;
  onClick: () => void;
  sponsored?: boolean;
}

export const ProductCardCompact = ({ 
  product, 
  onClick, 
  sponsored = false 
}: ProductCardCompactProps) => {
  const queryClient = useQueryClient();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
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

  const rating = (Math.floor(Math.random() * 15) + 35) / 10;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full">
      <div className="flex flex-row w-full" onClick={onClick}>
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
            {sponsored && (
              <Badge variant="outline" className="absolute top-1 left-1 text-xs bg-purple-100 text-purple-600 border-purple-200">
                Ad
              </Badge>
            )}
          </div>
        </div>
        
        <div className="w-2/3 sm:w-3/4 p-3">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between">
                <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                <ProductLikeButton 
                  productId={product.id}
                  size="sm"
                  variant="ghost"
                  className="ml-auto"
                />
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
                {product.brand_name || product.brand || product.category || "General"}
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
};
