
import { IndianRupee } from "lucide-react";
import { formatPrice } from "@/utils/productUtils";

interface ProductCardPricingProps {
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
}

export const ProductCardPricing = ({ 
  price, 
  originalPrice, 
  discountPercentage 
}: ProductCardPricingProps) => {
  return (
    <div className="text-right flex flex-col items-end">
      <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-0.5">
        <IndianRupee className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        {formatPrice(price).replace('₹', '')}
      </span>
      {originalPrice && (
        <>
          <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
            ₹{formatPrice(originalPrice).replace('₹', '')}
          </span>
          {discountPercentage && (
            <span className="text-[10px] sm:text-xs text-green-500">
              {discountPercentage}% off
            </span>
          )}
        </>
      )}
    </div>
  );
};
