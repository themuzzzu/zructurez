
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
  // Support for direct props as well
  id?: string;
  title?: string;
  price?: number;
  description?: string;
  category?: string; 
  imageUrl?: string;
  views?: number;
  badge?: string;
  rank?: number;
  originalPrice?: number;
  images?: any[];
  brandName?: string;
  condition?: string;
  isDiscounted?: boolean;
  isUsed?: boolean;
  isBranded?: boolean;
  stock?: number;
}

export const ProductCard = ({ 
  product,
  layout = "grid4x4", 
  sponsored = false,
  // Direct props
  id,
  title,
  price,
  description,
  category,
  imageUrl,
  views,
  badge,
  rank,
  originalPrice,
  images,
  brandName,
  condition,
  isDiscounted,
  isUsed,
  isBranded,
  stock
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // If individual props are provided, use them, otherwise use the product object
  const productId = id || (product?.id);
  const productName = title || (product?.name) || (product?.title);
  const productPrice = price !== undefined ? price : product?.price;
  const productDesc = description || product?.description;
  const productCat = category || product?.category;
  const productImgUrl = imageUrl || product?.image_url;
  const productViews = views !== undefined ? views : product?.views;
  const productBadge = badge || product?.badge;
  const productRank = rank !== undefined ? rank : product?.rank;
  const productOriginalPrice = originalPrice !== undefined ? originalPrice : product?.original_price;
  const productImages = images || product?.product_images;
  const productBrandName = brandName || product?.brand_name;
  const productCondition = condition || product?.condition;
  const productIsDiscounted = isDiscounted !== undefined ? isDiscounted : product?.is_discounted;
  const productIsUsed = isUsed !== undefined ? isUsed : product?.is_used;
  const productIsBranded = isBranded !== undefined ? isBranded : product?.is_branded;
  const productStock = stock !== undefined ? stock : product?.stock;
  
  const handleCardClick = () => {
    navigate(`/products/${productId}`);
  };
  
  const displayPrice = formatPrice(productPrice);
  
  const displayOriginalPrice = productIsDiscounted && productOriginalPrice 
    ? formatPrice(productOriginalPrice)
    : null;
  
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
      <div className={imageContainerClassName}>
        {!imageLoaded && (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        )}
        <img 
          src={productImgUrl || "https://via.placeholder.com/300x300"} 
          alt={productName} 
          className={`w-full h-full object-cover ${imageLoaded ? 'img-loaded' : 'img-loading'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {productIsDiscounted && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            SALE
          </Badge>
        )}
        
        {sponsored && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-yellow-500/90 text-xs">
            Sponsored
          </Badge>
        )}
        
        <div className="absolute top-2 right-2">
          <LikeProvider>
            <ProductLikeButton productId={productId} />
          </LikeProvider>
        </div>
      </div>
      
      <CardContent className={`flex-1 p-3 ${isListLayout ? 'flex flex-col justify-between' : ''}`}>
        <div>
          <h3 className="font-medium text-sm line-clamp-1 mb-1">{productName}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{productDesc}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">{displayPrice}</p>
            {displayOriginalPrice && (
              <p className="text-xs text-muted-foreground line-through">{displayOriginalPrice}</p>
            )}
          </div>
          
          {productIsBranded && (
            <Badge variant="outline" className="text-xs">Branded</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
