
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import { ProductLikeButton } from "./ProductLikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { GridLayoutType } from "./types/ProductTypes";
import { LikeProvider } from "./LikeContext";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: any;
  layout?: GridLayoutType;
  sponsored?: boolean;
}

export const ProductCard = ({ product, layout = "grid4x4", sponsored = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };
  
  const price = formatPrice(product.price);
  
  const originalPrice = product.is_discounted && product.discount_percentage 
    ? formatPrice(product.price / (1 - product.discount_percentage / 100))
    : null;
  
  // Helper function to determine highlight tag badge color
  const getTagColor = (tag: string) => {
    switch(tag.toLowerCase()) {
      case 'bestseller':
        return 'bg-amber-500 text-white border-amber-600';
      case 'new':
        return 'bg-blue-500 text-white border-blue-600';
      case 'hot deal':
        return 'bg-red-500 text-white border-red-600';
      case 'trending':
        return 'bg-purple-500 text-white border-purple-600';
      case 'limited':
        return 'bg-orange-500 text-white border-orange-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  // Helper function to determine discount badge color based on percentage
  const getDiscountBadgeColor = (percentage?: number) => {
    if (!percentage) return 'bg-red-500';
    if (percentage >= 50) return 'bg-green-500 text-white';
    if (percentage >= 30) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };
  
  // Render different layouts based on the grid type
  if (layout === "grid1x1") {
    return (
      <motion.div 
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-border flex flex-col md:flex-row h-full"
          onClick={handleCardClick}
        >
          <div className="w-full md:w-1/3 aspect-square md:h-auto relative">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            )}
            <img 
              src={product.imageUrl || product.image_url || "https://via.placeholder.com/300x300"} 
              alt={product.title || product.name} 
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Highlight tags */}
            {product.highlight_tags && product.highlight_tags.length > 0 && (
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {product.highlight_tags.map((tag: string, index: number) => (
                  <Badge 
                    key={index}
                    className={`${getTagColor(tag)} text-xs font-semibold shadow-sm`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{product.title || product.name}</h2>
                {product.category && (
                  <Badge variant="outline" className="mt-1">
                    {product.category}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center">
                <LikeProvider>
                  <ProductLikeButton productId={product.id} />
                </LikeProvider>
                
                {sponsored && (
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Sponsored
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground my-4 line-clamp-3">
              {product.description}
            </p>
            
            <div className="mt-auto flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold">{price}</span>
                {originalPrice && (
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    {originalPrice}
                  </span>
                )}
              </div>
              
              {product.is_discounted && product.discount_percentage && (
                <Badge className={`${getDiscountBadgeColor(product.discount_percentage)} text-white`}>
                  {Math.round(product.discount_percentage)}% OFF
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  if (layout === "grid2x2") {
    return (
      <motion.div 
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-border h-full flex flex-col"
          onClick={handleCardClick}
        >
          <div className="relative w-full aspect-video">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            )}
            <img 
              src={product.imageUrl || product.image_url || "https://via.placeholder.com/300x300"} 
              alt={product.title || product.name} 
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'img-loaded hover:scale-105' : 'img-loading'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {product.is_discounted && product.discount_percentage && (
              <Badge className={`absolute top-2 left-2 ${getDiscountBadgeColor(product.discount_percentage)}`}>
                {Math.round(product.discount_percentage)}% OFF
              </Badge>
            )}
            
            {sponsored && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Sponsored
              </Badge>
            )}
            
            {/* Highlight tags */}
            {product.highlight_tags && product.highlight_tags.length > 0 && (
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {product.highlight_tags.map((tag: string, index: number) => (
                  <Badge 
                    key={index}
                    className={`${getTagColor(tag)} text-xs font-semibold shadow-sm`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <CardContent className="flex-1 p-4 pt-3">
            <div className="flex justify-between">
              <h3 className="font-medium line-clamp-1">{product.title || product.name}</h3>
              <LikeProvider>
                <ProductLikeButton productId={product.id} size="sm" />
              </LikeProvider>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">
              {product.description}
            </p>
            
            {product.category && (
              <Badge variant="outline" className="text-xs mt-1">
                {product.category}
              </Badge>
            )}
            
            <div className="mt-2 pt-2 border-t flex justify-between items-center">
              <span className="font-bold">{price}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  // Default grid4x4 (compact) view
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-border h-full flex flex-col"
        onClick={handleCardClick}
      >
        <div className="relative w-full aspect-square">
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          )}
          <img 
            src={product.imageUrl || product.image_url || "https://via.placeholder.com/300x300"} 
            alt={product.title || product.name} 
            className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'img-loaded hover:scale-105' : 'img-loading'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {product.is_discounted && product.discount_percentage && (
            <Badge className={`absolute top-2 left-2 ${getDiscountBadgeColor(product.discount_percentage)} text-xs shadow-sm`}>
              {Math.round(product.discount_percentage)}% OFF
            </Badge>
          )}
          
          <div className="absolute top-2 right-2">
            <LikeProvider>
              <ProductLikeButton productId={product.id} size="sm" />
            </LikeProvider>
          </div>
          
          {sponsored && (
            <Badge variant="outline" className="absolute bottom-2 right-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Sponsored
            </Badge>
          )}
          
          {/* Highlight tags */}
          {product.highlight_tags && product.highlight_tags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {product.highlight_tags.map((tag: string, index: number) => (
                <Badge 
                  key={index}
                  className={`${getTagColor(tag)} text-xs font-semibold shadow-sm`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <CardContent className="flex-1 p-3 pt-2">
          <h3 className="font-medium text-sm line-clamp-1 mb-1">{product.title || product.name}</h3>
          
          <div className="flex items-baseline justify-between">
            <p className="font-bold text-sm">{price}</p>
            {originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{originalPrice}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
