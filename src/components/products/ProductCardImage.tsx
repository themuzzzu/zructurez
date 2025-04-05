
import { useCallback } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect, useRef } from "react";
import { trackEntityView } from "@/utils/viewsTracking";
import { ImageFallback } from "../ui/image-fallback";
import { LikeProvider } from "./LikeContext";
import { ProductLikeButton } from "./ProductLikeButton";

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
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Define a default fallback source for images
  const defaultFallbackSrc = "/placeholders/image-placeholder.jpg";

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

  // Track product view when the product becomes visible
  useEffect(() => {
    if (isVisible && productId) {
      // Track the view after a small delay to ensure the user actually sees the product
      const timer = setTimeout(() => {
        trackEntityView('product', productId);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, productId]);

  return (
    <div 
      className="cursor-pointer group relative overflow-hidden w-full touch-manipulation" 
      onClick={onClick}
      ref={imageRef}
    >
      <AspectRatio ratio={1} className="bg-gray-100 dark:bg-zinc-700">
        {/* Loading skeleton - simplified */}
        {!isVisible && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
        )}
        
        {/* Main image using improved ImageFallback component */}
        {isVisible && (
          <ImageFallback
            src={imageUrl || ''}
            alt={title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            fallbackSrc={defaultFallbackSrc}
            lazyLoad={false} // We're already handling visibility detection above
          />
        )}
      </AspectRatio>
      
      {/* Quick view overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="bg-white dark:bg-zinc-800 text-xs font-medium px-3 py-1.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Quick view
        </div>
      </div>
      
      {/* Wishlist button */}
      <LikeProvider>
        <div className="absolute top-2 right-2 z-10">
          <ProductLikeButton 
            productId={productId} 
            size="sm"
            variant="ghost"
            className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
          />
        </div>
      </LikeProvider>
    </div>
  );
};
