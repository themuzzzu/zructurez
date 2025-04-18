
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPriceWithoutSymbol, calculateDiscountPercentage } from "@/utils/productUtils";

interface ProductCardPricingProps {
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isDiscounted?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ProductCardPricing = ({
  price,
  originalPrice,
  discountPercentage,
  isDiscounted = false,
  size = "md"
}: ProductCardPricingProps) => {
  // Calculate discount percentage if not provided
  const displayDiscount = discountPercentage || 
    (isDiscounted && originalPrice ? calculateDiscountPercentage(originalPrice, price) : 0);
  
  // Determine text size based on size prop
  const priceTextClass = {
    "sm": "text-sm font-medium",
    "md": "text-base font-semibold",
    "lg": "text-lg font-bold"
  }[size];
  
  const originalPriceTextClass = {
    "sm": "text-xs",
    "md": "text-xs",
    "lg": "text-sm"
  }[size];
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-baseline gap-2">
        <span className={priceTextClass}>{formatPrice(price)}</span>
        
        {isDiscounted && originalPrice && originalPrice > price && (
          <span className={`${originalPriceTextClass} text-muted-foreground line-through`}>
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      
      {displayDiscount > 0 && (
        <Badge 
          variant="outline" 
          className={`text-xs px-1.5 ${
            displayDiscount >= 40 ? "bg-green-100 text-green-700 border-green-200" : 
            displayDiscount >= 20 ? "bg-amber-100 text-amber-700 border-amber-200" :
            "bg-red-100 text-red-700 border-red-200"
          }`}
        >
          {displayDiscount}% off
        </Badge>
      )}
    </div>
  );
};
