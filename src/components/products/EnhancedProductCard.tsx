
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import { ProductType, GridLayoutType } from "./types/ProductTypes";
import { cn } from "@/lib/utils";
import { useLike } from "./LikeContext";
import { motion } from "framer-motion";

interface EnhancedProductCardProps {
  product: ProductType;
  layout?: GridLayoutType;
  sponsored?: boolean;
}

export const EnhancedProductCard = ({ 
  product, 
  layout = "grid4x4", 
  sponsored = false 
}: EnhancedProductCardProps) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isLiked, toggleLike } = useLike();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(product.id);
    
    if (!isLiked(product.id)) {
      toast.success("Added to wishlist");
    }
  };
  
  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(`${product.title} added to cart`);
    }, 500);
  };
  
  // Calculate standard discount percentage if needed
  const discountPercentage = 
    product.discount_percentage || 
    (product.is_discounted && product.original_price && product.price 
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
      : 0);

  // Configure card layout based on the grid layout
  const isListView = layout === "grid1x1";
  
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all border",
          isListView ? "flex" : "flex flex-col",
          sponsored ? "border-amber-200 bg-amber-50/30" : ""
        )}
        onClick={handleClick}
      >
        {/* Image container with responsive sizing */}
        <div 
          className={cn(
            "relative overflow-hidden bg-gray-100",
            isListView 
              ? "w-[120px] h-[160px] sm:w-[180px] sm:h-[220px]" 
              : layout === "grid2x2"
                ? "w-full aspect-[4/3]"
                : "w-full aspect-square"
          )}
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                !imageLoaded ? "blur-sm" : ""
              )}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          )}
          
          {/* Badge for sponsored content */}
          {sponsored && (
            <Badge 
              variant="outline" 
              className="absolute top-2 left-2 bg-white/80 text-amber-600 border-amber-200 text-xs"
            >
              Ad
            </Badge>
          )}
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <Badge 
              className={cn(
                "absolute bottom-2 left-2 text-white text-xs",
                discountPercentage >= 50 ? "bg-green-600" :
                discountPercentage >= 30 ? "bg-orange-600" : "bg-pink-600"
              )}
            >
              {discountPercentage}% OFF
            </Badge>
          )}
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white hover:text-red-500"
            onClick={handleLikeClick}
          >
            <Heart className={cn(
              "h-4 w-4",
              isLiked ? "fill-red-500 text-red-500" : ""
            )} />
          </Button>
          
          {/* Feature badges (New, Bestseller, etc) */}
          {product.highlight_tags && product.highlight_tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.highlight_tags.slice(0, 1).map(tag => (
                <Badge 
                  key={tag}
                  className={cn(
                    "text-white text-xs capitalize",
                    tag === 'bestseller' ? "bg-amber-500" :
                    tag === 'new' ? "bg-blue-500" :
                    tag === 'trending' ? "bg-purple-500" :
                    "bg-gray-500"
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Content section */}
        <div className={cn(
          "flex flex-col",
          isListView ? "flex-1 p-4" : "p-3"
        )}>
          {/* Brand name */}
          <div className="text-xs text-gray-500 mb-1 truncate">
            {product.brand}
          </div>
          
          {/* Title */}
          <h3 className={cn(
            "font-medium mb-1",
            isListView ? "text-base line-clamp-2" : "text-sm line-clamp-1"
          )}>
            {product.title}
          </h3>
          
          {/* Rating (if available) */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs text-white",
                product.rating >= 4 ? "bg-green-600" :
                product.rating >= 3 ? "bg-amber-500" : "bg-red-500"
              )}>
                <span>{product.rating.toFixed(1)}</span>
                <Star className="h-3 w-3 fill-current" />
              </div>
              {product.rating_count > 0 && (
                <span className="text-xs text-gray-500">({product.rating_count})</span>
              )}
            </div>
          )}
          
          {/* Description for list view */}
          {isListView && product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {product.description}
            </p>
          )}
          
          {/* Price section */}
          <div className="flex items-baseline gap-2 mt-auto mb-2">
            <span className={cn(
              "font-semibold",
              isListView ? "text-lg" : ""
            )}>
              {formatPrice(product.price)}
            </span>
            
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          
          {/* Add to cart button */}
          <Button 
            variant="default"
            size="sm"
            className="w-full text-white"
            onClick={addToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className={cn("h-3.5 w-3.5", isListView ? "mr-2" : "mr-1.5")} />
            {isListView ? "Add to Cart" : "Add"}
            {isAddingToCart && (
              <div className="ml-2 h-3.5 w-3.5 border-2 border-white border-r-transparent rounded-full animate-spin" />
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
