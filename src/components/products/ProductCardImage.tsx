
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
    <div className="cursor-pointer group relative overflow-hidden" onClick={onClick}>
      <AspectRatio ratio={1} className="bg-muted transition-all duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
          ₹{formatPrice(price).replace('₹', '')}
        </div>
      </AspectRatio>
    </div>
  );
};
