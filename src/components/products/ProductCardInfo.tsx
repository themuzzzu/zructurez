
import { Star, Shield, Clock } from "lucide-react";
import { ProductCardPricing } from "./ProductCardPricing";
import { Badge } from "@/components/ui/badge";

interface ProductCardInfoProps {
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  onClick: () => void;
  stock: number;
  isFreeDelivery?: boolean;
  isExpress?: boolean;
}

export const ProductCardInfo = ({ 
  title, 
  description, 
  category, 
  subcategory,
  price,
  originalPrice,
  discountPercentage,
  onClick,
  stock,
  isFreeDelivery = price > 499,
  isExpress = Math.random() > 0.5
}: ProductCardInfoProps) => {
  // Generate a fake rating for display purposes
  const rating = (Math.floor(Math.random() * 20) + 35) / 10; // Random rating between 3.5 and 5.0
  const reviewCount = Math.floor(Math.random() * 2000) + 10; // Random review count
  
  return (
    <div className="p-3.5 cursor-pointer touch-manipulation" onClick={onClick}>
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex-1 pr-1">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {category}
            </span>
            {subcategory && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {subcategory}
                </span>
              </>
            )}
          </div>
          
          <h3 className="font-medium text-sm md:text-base line-clamp-1 leading-tight mb-1">{title}</h3>
          
          <div className="flex items-center text-xs mb-1.5">
            <div className="flex items-center text-yellow-500 mr-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(rating) ? "fill-yellow-500" : "fill-gray-200 dark:fill-gray-700"}
                />
              ))}
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
            <span className="mx-1 text-gray-400">|</span>
            <span className="text-gray-500 dark:text-gray-400">{reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-xs mb-2.5 line-clamp-2">{description}</p>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start">
          <ProductCardPricing 
            price={price} 
            originalPrice={originalPrice} 
            discountPercentage={discountPercentage}
          />
          
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {stock < 10 && stock > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs py-0 h-5">
                Only {stock} left
              </Badge>
            )}
            
            {isFreeDelivery && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs py-0 h-5 flex items-center gap-0.5">
                <Clock size={10} className="mr-0.5" />
                Free Delivery
              </Badge>
            )}
            
            {isExpress && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs py-0 h-5 flex items-center gap-0.5">
                <Shield size={10} className="mr-0.5" />
                Express
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
