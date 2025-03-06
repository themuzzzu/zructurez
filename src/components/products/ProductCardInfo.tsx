
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
  return (
    <div className="p-3 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1 pr-2">
          <h3 className="text-sm font-semibold text-foreground line-clamp-1">{title}</h3>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {category} {subcategory && `• ${subcategory}`}
          </div>
        </div>
        <ProductCardPricing 
          price={price} 
          originalPrice={originalPrice} 
          discountPercentage={discountPercentage}
        />
      </div>
      
      <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{description}</p>
    </div>
  );
};
