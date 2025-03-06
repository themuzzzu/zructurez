
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
    <div className="text-right">
      <span className="text-lg font-bold text-primary flex items-center gap-1">
        <IndianRupee className="h-4 w-4" />
        {formatPrice(price).replace('₹', '')}
      </span>
      {originalPrice && (
        <div className="flex flex-col items-end">
          <span className="text-sm text-muted-foreground line-through">
            ₹{formatPrice(originalPrice).replace('₹', '')}
          </span>
          <span className="text-xs text-green-500">
            {discountPercentage}% off
          </span>
        </div>
      )}
    </div>
  );
};
