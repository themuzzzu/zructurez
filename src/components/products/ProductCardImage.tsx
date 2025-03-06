
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/utils/productUtils";

interface ProductCardImageProps {
  imageUrl: string | null;
  title: string;
  price: number;
  onClick: () => void;
}

export const ProductCardImage = ({ imageUrl, title, price, onClick }: ProductCardImageProps) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <AspectRatio ratio={16/9} className="bg-muted">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
          ₹{formatPrice(price).replace('₹', '')}
        </div>
      </AspectRatio>
    </div>
  );
};
