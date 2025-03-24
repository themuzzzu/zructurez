
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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-0.5">
        <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        {formatPrice(price).replace('₹', '')}
      </span>
      
      {originalPrice && (
        <>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
            ₹{formatPrice(originalPrice).replace('₹', '')}
          </span>
          
          {discountPercentage && (
            <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-500">
              {discountPercentage}% off
            </span>
          )}
        </>
      )}
    </div>
  );
};
