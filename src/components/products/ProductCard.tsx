
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/productUtils";
import { ShoppingBag } from "lucide-react";
import { ProductLikeButton } from "./ProductLikeButton";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "./types/ProductTypes";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category?: string;
    is_discounted?: boolean;
    discount_percentage?: number;
    original_price?: number;
  };
  layout?: GridLayoutType | "compact";
  showAddToCart?: boolean;
  sponsored?: boolean;
}

export function ProductCard({ 
  product, 
  layout = "grid4x4",
  showAddToCart = true,
  sponsored = false
}: ProductCardProps) {
  const navigate = useNavigate();
  const isCompact = layout === "compact";
  
  const handleClick = () => {
    navigate(`/marketplace/product/${product.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      <div className={`relative ${isCompact ? 'h-20' : 'h-36'} overflow-hidden`}>
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        
        {product.is_discounted && product.discount_percentage && (
          <Badge 
            className={`absolute top-1.5 right-1.5 bg-red-500 text-white font-medium ${isCompact ? 'text-[9px] py-0 h-4 px-1' : 'text-xs'}`}
          >
            {product.discount_percentage}% OFF
          </Badge>
        )}
        
        {sponsored && (
          <Badge 
            variant="outline" 
            className="absolute top-1.5 left-1.5 bg-yellow-500/90 text-white text-xs"
          >
            Ad
          </Badge>
        )}
      </div>
      
      <div className={`p-${isCompact ? '2' : '3'} flex-1 space-y-1.5`}>
        <div className="flex justify-between items-start">
          <h3 className={`font-medium line-clamp-1 ${isCompact ? 'text-xs' : 'text-sm'}`}>{product.title}</h3>
          {!isCompact && <ProductLikeButton productId={product.id} size="sm" />}
        </div>
        
        {product.category && (
          <Badge 
            variant="outline" 
            className={`${isCompact ? 'text-[8px] h-3.5 px-1' : 'text-[9px] h-4 px-1'} bg-transparent`}
          >
            {product.category}
          </Badge>
        )}
        
        {!isCompact && product.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-xs">{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className="text-[9px] line-through text-muted-foreground">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
      </div>
      
      {!isCompact && showAddToCart && (
        <div className="p-3 pt-0">
          <Button 
            className="w-full gap-1.5 text-xs py-1 h-auto" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart functionality would go here
            }}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      )}
    </Card>
  );
}
