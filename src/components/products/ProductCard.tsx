
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import { ProductLikeButton } from "./ProductLikeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { GridLayoutType } from "./types/ProductTypes";

interface ProductCardProps {
  product: any;
  layout?: GridLayoutType;
}

export const ProductCard = ({ product, layout = "grid4x4" }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };
  
  // Format the price properly
  const price = formatPrice(product.price);
  
  // Calculate original price if there's a discount
  const originalPrice = product.is_discounted && product.discount_percentage 
    ? formatPrice(product.price / (1 - product.discount_percentage / 100))
    : null;
  
  // Set layout-specific styles
  const isListLayout = layout === "list";
  const cardClassName = isListLayout 
    ? "flex flex-row overflow-hidden h-[150px]" 
    : "flex flex-col overflow-hidden h-full";
  
  const imageContainerClassName = isListLayout 
    ? "w-[120px] h-full flex-shrink-0" 
    : "w-full aspect-square";
  
  return (
    <Card 
      className={`${cardClassName} hover:shadow-md transition-shadow cursor-pointer relative group border-border`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className={imageContainerClassName}>
        {!imageLoaded && (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        )}
        <img 
          src={product.image_url || "https://via.placeholder.com/300x300"} 
          alt={product.name} 
          className={`w-full h-full object-cover ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {product.is_discounted && product.discount_percentage && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {Math.round(product.discount_percentage)}% OFF
          </Badge>
        )}
        
        {/* Like Button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ProductLikeButton productId={product.id} />
        </div>
      </div>
      
      {/* Product Details */}
      <CardContent className={`flex-1 p-3 ${isListLayout ? 'flex flex-col justify-between' : ''}`}>
        <div>
          <h3 className="font-medium text-sm line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">{price}</p>
            {originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{originalPrice}</p>
            )}
          </div>
          
          {product.is_branded && (
            <Badge variant="outline" className="text-xs">Branded</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
