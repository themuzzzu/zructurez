
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import { ProductLikeButton } from "./ProductLikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { GridLayoutType } from "./types/ProductTypes";
import { LikeProvider } from "./LikeContext";

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
  
  // Render different layouts based on the grid type
  if (layout === "grid1x1") {
    return (
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-border flex flex-col md:flex-row"
        onClick={handleCardClick}
      >
        <div className="w-full md:w-1/3 aspect-square md:h-auto">
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          )}
          <img 
            src={product.imageUrl || product.image_url || "https://via.placeholder.com/300x300"} 
            alt={product.title || product.name} 
            className={`w-full h-full object-cover ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
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
              <Badge className="bg-red-500 text-white">
                {Math.round(product.discount_percentage)}% OFF
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  }
  
  if (layout === "grid2x2") {
    return (
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
            className={`w-full h-full object-cover ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {product.is_discounted && product.discount_percentage && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              {Math.round(product.discount_percentage)}% OFF
            </Badge>
          )}
          
          {sponsored && (
            <Badge variant="outline" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Sponsored
            </Badge>
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
    );
  }
  
  // Default grid4x4 (compact) view
  return (
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
          className={`w-full h-full object-cover ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {product.is_discounted && product.discount_percentage && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
            {Math.round(product.discount_percentage)}% OFF
          </Badge>
        )}
        
        <div className="absolute top-2 right-2">
          <LikeProvider>
            <ProductLikeButton productId={product.id} size="sm" />
          </LikeProvider>
        </div>
        
        {sponsored && (
          <Badge variant="outline" className="absolute bottom-2 left-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Sponsored
          </Badge>
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
  );
};
