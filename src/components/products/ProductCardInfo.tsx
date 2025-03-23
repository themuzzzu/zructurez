
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
    <div className="p-1.5 cursor-pointer touch-manipulation" onClick={onClick}>
      <div className="flex justify-between items-start mb-0.5">
        <div className="flex-1 pr-1">
          <h3 className="text-xs font-semibold text-foreground line-clamp-1">{title}</h3>
          <div className="text-[10px] text-muted-foreground line-clamp-1">
            {category} {subcategory && `• ${subcategory}`}
          </div>
        </div>
        <ProductCardPricing 
          price={price} 
          originalPrice={originalPrice} 
          discountPercentage={discountPercentage}
        />
      </div>
      
      <p className="text-muted-foreground text-[10px] mb-1 line-clamp-2">{description}</p>
    </div>
  );
};
