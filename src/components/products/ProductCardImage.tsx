
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductCardImageProps {
  imageUrl: string | null;
  title: string;
  price: number;
  onClick: () => void;
  productId: string;
}

export const ProductCardImage = ({ 
  imageUrl, 
  title, 
  price, 
  onClick,
  productId
}: ProductCardImageProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="cursor-pointer group relative overflow-hidden w-full touch-manipulation" onClick={onClick}>
      <AspectRatio ratio={1} className="bg-gray-100 dark:bg-zinc-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-700">
            <span className="text-gray-400 dark:text-gray-500 text-xs">No image</span>
          </div>
        )}
      </AspectRatio>
      
      {/* Quick view overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="bg-white dark:bg-zinc-800 text-xs font-medium px-3 py-1.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Quick view
        </div>
      </div>
      
      {/* Wishlist button */}
      <button 
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:scale-110 transition-transform z-10"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"} />
      </button>
    </div>
  );
};
