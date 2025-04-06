
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { ImageFallback } from "@/components/ui/image-fallback";
import { useToast } from "@/hooks/use-toast";
import { useLike } from "./LikeContext"; // Fix: Changed useLikeContext to useLike
import { formatCountNumber } from "@/utils/viewsTracking";
import { incrementViewCount } from "@/utils/viewsTracking";
import { GridLayoutType } from './types/ProductTypes';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category?: string;
  description?: string;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  rating?: number;
  rating_count?: number;
  views?: number;
  wishlist_count?: number;
}

interface ProductCardProps {
  product: Product;
  layout?: GridLayoutType;
  className?: string;
  sponsored?: boolean; // Add sponsored prop
}

export const ProductCard = ({ product, layout = "grid4x4", className, sponsored = false }: ProductCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLiked, toggleLike } = useLike();
  const [isHovered, setIsHovered] = useState(false);
  
  const liked = isLiked(product.id);

  const handleProductClick = () => {
    incrementViewCount('product', product.id);
    navigate(`/product/${product.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(product.id);
    toast({
      title: liked ? "Removed from wishlist" : "Added to wishlist",
      description: liked ? "Product has been removed from your wishlist" : "Product has been added to your wishlist",
      variant: liked ? "destructive" : "default",
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  // Use card layout based on the specified layout type
  const isListLayout = layout === 'list';

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 h-full group relative",
        isListLayout ? "flex flex-row" : "flex flex-col",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image section */}
      <div className={cn(
        "relative overflow-hidden",
        isListLayout ? "w-1/3" : "w-full aspect-square"
      )}>
        <ImageFallback
          src={product.image_url}
          alt={product.title}
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          aspectRatio={isListLayout ? "square" : "square"}
          trackView={false} // We track on click handler instead
          productId={product.id}
        />

        {/* Discount badge */}
        {product.is_discounted && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount_percentage ? `-${product.discount_percentage}%` : "SALE"}
          </div>
        )}

        {/* View count badge */}
        {product.views && product.views > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            👁️ {formatCountNumber(product.views)}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className={cn(
        "flex flex-col",
        isListLayout ? "w-2/3 p-4" : "p-3"
      )}>
        <h3 className="font-medium text-base line-clamp-2 mb-1">{product.title}</h3>
        
        {/* Price section */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center">
            <span className="font-bold text-lg">${product.price}</span>
            {product.is_discounted && product.original_price && (
              <span className="text-sm line-through text-muted-foreground ml-2">
                ${product.original_price}
              </span>
            )}
          </div>
        </div>

        {/* Ratings */}
        {product.rating !== undefined && (
          <div className="flex items-center mt-1">
            <div className="flex text-yellow-400">
              {Array(5).fill(0).map((_, i) => (
                <span key={i}>
                  {i < Math.round(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs ml-1 text-muted-foreground">
              ({product.rating_count || 0})
            </span>
          </div>
        )}

        {/* Wishlist count if available */}
        {product.wishlist_count && product.wishlist_count > 0 && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Heart className="w-3 h-3 mr-1" />
            <span>{formatCountNumber(product.wishlist_count)} wishlisted</span>
          </div>
        )}

        {/* Action buttons */}
        <div className={cn(
          "flex mt-2 gap-2",
          isListLayout ? "justify-start" : "justify-between"
        )}>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "rounded-full w-9 h-9 p-0 flex items-center justify-center",
              liked && "text-red-500 hover:text-red-600"
            )}
            onClick={handleLikeClick}
          >
            <Heart
              className={cn("w-4 h-4", liked && "fill-current")}
            />
          </Button>
          <Button
            size="sm"
            className={cn(
              "rounded-full",
              isListLayout ? "px-4" : "w-9 h-9 p-0"
            )}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            {isListLayout && <span className="ml-2">Add to cart</span>}
          </Button>
        </div>
      </div>
    </Card>
  );
};
