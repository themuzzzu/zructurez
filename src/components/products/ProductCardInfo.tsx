
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
    <div className="p-4 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="text-sm text-muted-foreground">
            {category} {subcategory && `• ${subcategory}`}
          </div>
        </div>
        <ProductCardPricing 
          price={price} 
          originalPrice={originalPrice} 
          discountPercentage={discountPercentage}
        />
      </div>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
    </div>
  );
};
