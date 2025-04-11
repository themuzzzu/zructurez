
import { IndianRupee } from "lucide-react";
import { formatPriceWithoutSymbol } from "@/utils/productUtils";

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
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-0.5">
        <IndianRupee className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        {formatPriceWithoutSymbol(price)}
      </span>
      
      {originalPrice && (
        <>
          <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
            ₹{formatPriceWithoutSymbol(originalPrice)}
          </span>
          
          {discountPercentage && (
            <span className="text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-500">
              {discountPercentage}% off
            </span>
          )}
        </>
      )}
    </div>
  );
};
