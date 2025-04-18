
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

  // Calculate the discount percentage
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Determine if it's a list view
  const isList = layout === "grid1x1";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group relative",
        isList ? "w-full" : "w-full"
      )}
    >
      <Card 
        className={cn(
          "overflow-hidden border-0 rounded-none hover:shadow-lg transition-shadow duration-300",
          isList ? "flex" : "flex flex-col"
        )}
        onClick={handleCardClick}
      >
        {/* Image container */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100",
          isList ? "w-[200px] h-[250px]" : "aspect-[3/4] w-full"
        )}>
          <img
            src={product.imageUrl || product.image_url}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
              !imageLoaded && "blur-sm"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
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
            <Badge className="absolute bottom-2 left-2 bg-pink-500">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "flex flex-col",
          isList ? "flex-1 p-4" : "p-3"
        )}>
          {/* Brand name */}
          <h3 className="font-medium text-base text-gray-900 mb-1">
            {product.brand_name || product.brand || "Brand"}
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
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="text-sm text-pink-500">
                    ({discountPercentage}% OFF)
                  </span>
                </>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded text-sm">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-current" />
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
              {product.highlights && (
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {product.highlights.slice(0, 3).map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
