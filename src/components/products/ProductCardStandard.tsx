
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/utils/productUtils";
import { ProductType } from "./types/ProductTypes";
import { Product } from "@/types/product";
import { ProductCardRating } from "./ProductCardRating";
import { ProductLikeButton } from "./ProductLikeButton";

interface ProductCardStandardProps {
  product: Product | ProductType;
  onClick: () => void;
  isGrid2x2: boolean;
  sponsored?: boolean;
}

export const ProductCardStandard = ({ 
  product, 
  onClick, 
  isGrid2x2,
  sponsored = false 
}: ProductCardStandardProps) => {
  const queryClient = useQueryClient();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
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

  // Generate random rating for display - don't change on hover
  const rating = useState((Math.floor(Math.random() * 15) + 35) / 10)[0];
  
  // Get image URL, handling both property names
  const imageUrl = product.imageUrl || product.image_url;
  
  // Get brand name, handling both property names
  const brandName = product.brand_name || product.brand || product.category || "General";
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full">
      <div className="relative">
        <div 
          className="aspect-square cursor-pointer" 
          onClick={onClick}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
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
        
        {sponsored && (
          <Badge variant="outline" className="absolute top-2 left-2 text-xs py-0 px-1.5 bg-purple-100 text-purple-600 border-purple-200">
            Ad
          </Badge>
        )}
        
        <div className="absolute top-2 right-2">
          <ProductLikeButton 
            productId={product.id} 
            size="sm" 
            variant="ghost"
          />
        </div>
      </div>
      
      <div className={`p-3 ${isGrid2x2 ? 'p-4' : ''}`} onClick={onClick}>
        <div className="mb-1">
          <div className="text-xs text-gray-500 mb-1">
            {brandName}
          </div>
          <h3 className={`font-medium line-clamp-1 ${isGrid2x2 ? 'text-base' : 'text-sm'}`}>
            {product.title}
          </h3>
        </div>
        
        <ProductCardRating rating={rating} />
        
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
          className="w-full mt-1 text-white"
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
