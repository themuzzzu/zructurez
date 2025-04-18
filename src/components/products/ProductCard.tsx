
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GridLayoutType } from "./types/ProductTypes";

interface ProductCardProps {
  product: any;
  layout?: GridLayoutType;
  sponsored?: boolean;
}

export const ProductCard = ({ product, layout = "grid4x4", sponsored = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Format the price with Indian currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate the discount percentage if both price and original_price exist
  const discountPercentage = product.original_price && product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : product.discount_percentage || 0;

  // Determine if it's a list view
  const isList = layout === "grid1x1";
  
  // Fixed height for different layouts
  const imageHeight = isList 
    ? "h-[200px] w-[150px] sm:h-[250px] sm:w-[200px]" 
    : layout === "grid2x2" 
      ? "aspect-[3/4]" 
      : "aspect-[3/4]";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group relative w-full",
        sponsored ? "ring-1 ring-yellow-200" : ""
      )}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-shadow duration-300 hover:shadow-lg",
          isList ? "flex" : "flex flex-col"
        )}
        onClick={handleCardClick}
      >
        {/* Left side - Image container */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
          isList ? imageHeight : "w-full " + imageHeight
        )}>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                !imageLoaded && "blur-sm"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          
          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart className={cn(
              "w-5 h-5 transition-colors",
              isLiked ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
            )} />
          </button>

          {/* Discount tag */}
          {discountPercentage > 0 && (
            <Badge className="absolute bottom-2 left-2 bg-pink-600 text-white">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Right side - Content */}
        <div className={cn(
          "flex flex-col",
          isList ? "flex-1 p-4" : "p-3"
        )}>
          {/* Brand name */}
          <h3 className="font-medium text-base text-gray-900 mb-1 truncate">
            {product.brand || "Brand"}
          </h3>
          
          {/* Product title */}
          <p className={cn(
            "text-gray-600 text-sm mb-2",
            isList ? "line-clamp-2" : "line-clamp-1"
          )}>
            {product.title}
          </p>

          {/* Price and rating */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <span className="text-sm text-pink-600">
                  ({discountPercentage}% OFF)
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-current" />
                {product.rating_count > 0 && (
                  <span className="text-xs">({product.rating_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Additional details for list view */}
          {isList && (
            <div className="mt-4 space-y-2">
              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              )}
              {product.highlights && product.highlights.length > 0 && (
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {product.highlights.slice(0, 3).map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              )}
              
              {/* Special offers/deals for list view */}
              {(discountPercentage > 0 || sponsored) && (
                <div className="mt-2 text-sm">
                  {sponsored && (
                    <Badge variant="outline" className="text-xs mr-2 border-yellow-300 text-yellow-700">
                      Sponsored
                    </Badge>
                  )}
                  {discountPercentage > 20 && (
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                      Great Deal
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Sponsored indicator */}
        {sponsored && !isList && (
          <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5">
            Sponsored
          </div>
        )}
      </Card>
    </motion.div>
  );
};
