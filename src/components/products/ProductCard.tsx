
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { Product, GridLayoutType } from "./types/ProductTypes";
import { Link } from "react-router-dom";
import { formatCountNumber } from "@/utils/viewsTracking";
import { trackEntityView } from "@/utils/viewsTracking";
import { useLikes } from "./LikeContext";
import { motion } from "framer-motion";

// Update the interface to include sponsored property
export interface ProductCardProps {
  product: Product;
  layout?: "grid1x1" | "grid2x1" | "list" | GridLayoutType;
  badge?: string;
  rank?: number;
  sponsored?: boolean;
}

export const ProductCard = ({ 
  product, 
  layout = "grid1x1",
  badge,
  rank,
  sponsored = false
}: ProductCardProps) => {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(product.id);
  
  const handleClick = () => {
    // Track the product view when card is clicked
    trackEntityView('product', product.id);
  };

  // Card layout classes based on layout prop
  const getCardClasses = () => {
    switch (layout) {
      case "list":
        return "flex flex-row h-auto";
      case "grid1x1":
        return "flex flex-col h-full";
      case "grid2x2":
      case "grid3x3":
      case "grid4x4":
      default:
        return "flex flex-col h-full";
    }
  };
  
  // Image container classes based on layout
  const getImageContainerClasses = () => {
    switch (layout) {
      case "list":
        return "w-1/3 min-w-[120px]";
      case "grid1x1":
      case "grid2x2":
      case "grid3x3":
      case "grid4x4":
      default:
        return "w-full aspect-square";
    }
  };
  
  // Content container classes based on layout
  const getContentClasses = () => {
    switch (layout) {
      case "list":
        return "flex-1 p-3";
      case "grid1x1":
      case "grid2x2":
      case "grid3x3":
      case "grid4x4":
      default:
        return "p-3 flex-1 flex flex-col";
    }
  };
  
  return (
    <Link to={`/product/${product.id}`} onClick={handleClick}>
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className={cn(
          getCardClasses(),
          "overflow-hidden hover:shadow-md transition-shadow duration-300"
        )}>
          <div className={cn(
            getImageContainerClasses(),
            "relative overflow-hidden"
          )}>
            <img 
              src={product.image_url || product.imageUrl} 
              alt={product.title || product.name || "Product image"} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/300x300/EEE/31343C?text=Image"; 
              }}
            />
            
            {/* Indicator section - discount badge, rank, sponsored tag, etc */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_discounted && (
                <Badge variant="destructive" className="text-xs font-semibold">
                  {product.discount_percentage ? `-${product.discount_percentage}%` : 'SALE'}
                </Badge>
              )}
              
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
              
              {rank && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                  #{rank}
                </Badge>
              )}
              
              {sponsored && (
                <Badge variant="outline" className="bg-white/80 text-xs font-normal">
                  Sponsored
                </Badge>
              )}
              
              {product.highlight_tags && product.highlight_tags[0] && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">
                  {product.highlight_tags[0]}
                </Badge>
              )}
            </div>
            
            {/* Like button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white h-8 w-8 rounded-full shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(product.id);
              }}
            >
              <Heart 
                className={cn(
                  "h-4 w-4", 
                  liked ? "fill-red-500 text-red-500" : "text-gray-600"
                )} 
              />
            </Button>
          </div>
          
          <div className={getContentClasses()}>
            <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2">
              {product.title || product.name}
            </h3>
            
            <div className="mt-auto pt-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  ${product.price?.toFixed(2)}
                  {product.is_discounted && product.original_price && (
                    <span className="text-xs line-through text-muted-foreground ml-1">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  {typeof product.views === 'number' && (
                    <div className="flex items-center mr-2">
                      <Eye className="h-3 w-3 mr-1" />
                      {formatCountNumber(product.views)}
                    </div>
                  )}
                  {typeof product.wishlist_count === 'number' && (
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {formatCountNumber(product.wishlist_count)}
                    </div>
                  )}
                </div>
              </div>
              
              {product.rating !== undefined && (
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(product.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  {product.rating_count && (
                    <span className="text-xs ml-1 text-muted-foreground">
                      ({product.rating_count})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

// Helper function to conditionally apply classnames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
