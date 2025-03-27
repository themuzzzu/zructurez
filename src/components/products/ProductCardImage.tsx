
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";

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
  const { isInWishlist, toggleWishlist, loading } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Optimized image URL with quality and sizing parameters
  const optimizedImageUrl = imageUrl 
    ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}quality=80&width=400&t=${Date.now() % 1000}`
    : null;
    
  // Low quality placeholder (thumbnail) for faster initial render
  const thumbnailUrl = optimizedImageUrl
    ? optimizedImageUrl.replace('width=400', 'width=40&blur=10')
    : null;

  // Use intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when within 200px of viewport
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <div 
      className="cursor-pointer group relative overflow-hidden w-full touch-manipulation" 
      onClick={onClick}
      ref={imageRef}
    >
      <AspectRatio ratio={1} className="bg-gray-100 dark:bg-zinc-700">
        {/* Show thumbnail placeholder while full image loads */}
        {thumbnailUrl && !imageLoaded && !imageFailed && (
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-cover absolute inset-0 filter blur-sm scale-105"
            aria-hidden="true"
            loading="eager"
          />
        )}
        
        {/* Low quality placeholder */}
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
        )}
        
        {/* Main image - only load when in viewport */}
        {optimizedImageUrl && isVisible && (
          <img
            src={optimizedImageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded 
                ? 'opacity-100 group-hover:scale-110 duration-500' 
                : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        )}
        
        {/* Fallback for failed images */}
        {imageFailed && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-700">
            <span className="text-gray-400 dark:text-gray-500 text-xs">Image not available</span>
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
        className={`absolute top-2 right-2 p-2 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:scale-110 transition-transform z-10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isInWishlist(productId) ? "Remove from wishlist" : "Add to wishlist"}
        disabled={loading}
      >
        <Heart 
          size={16} 
          className={isInWishlist(productId) ? "fill-red-500 text-red-500" : "text-gray-500"} 
        />
      </button>
    </div>
  );
};
