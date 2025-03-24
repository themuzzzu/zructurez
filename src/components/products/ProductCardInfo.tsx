
import { Star } from "lucide-react";
import { ProductCardPricing } from "./ProductCardPricing";

interface ProductCardInfoProps {
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  onClick: () => void;
}

export const ProductCardInfo = ({ 
  title, 
  description, 
  category, 
  subcategory,
  price,
  originalPrice,
  discountPercentage,
  onClick
}: ProductCardInfoProps) => {
  // Generate a fake rating for display purposes
  const rating = (Math.floor(Math.random() * 20) + 35) / 10; // Random rating between 3.5 and 5.0
  
  return (
    <div className="p-3 cursor-pointer touch-manipulation" onClick={onClick}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1 pr-1">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <div className="text-xs text-muted-foreground line-clamp-1 mb-1">
            {category} {subcategory && `• ${subcategory}`}
          </div>
          
          <div className="flex items-center text-xs">
            <div className="flex items-center text-yellow-500 mr-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(rating) ? "fill-yellow-500" : "fill-gray-200 dark:fill-gray-700"}
                />
              ))}
            </div>
            <span className="text-muted-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{description}</p>
      
      <ProductCardPricing 
        price={price} 
        originalPrice={originalPrice} 
        discountPercentage={discountPercentage}
      />
    </div>
  );
};
