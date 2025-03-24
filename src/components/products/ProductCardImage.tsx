
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardImageProps {
  imageUrl: string | null;
  title: string;
  price: number;
  onClick: () => void;
}

export const ProductCardImage = ({ imageUrl, title, price, onClick }: ProductCardImageProps) => {
  return (
    <div className="cursor-pointer group-hover:opacity-95 relative overflow-hidden w-full touch-manipulation" onClick={onClick}>
      <AspectRatio ratio={1} className="bg-gray-100 dark:bg-zinc-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-700">
            <span className="text-gray-400 dark:text-gray-500 text-xs">No image</span>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};
