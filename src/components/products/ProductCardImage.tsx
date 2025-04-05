
import { useCallback } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";
import { trackEntityView } from "@/utils/viewsTracking";
import { ImageFallback } from "../ui/image-fallback";
import { LikeProvider } from "./LikeContext";
import { ProductLikeButton } from "./ProductLikeButton";

// Quotes for loading screens
const loadingQuotes = [
  "Quality takes time, just like a good cup of coffee",
  "Good things come to those who wait",
  "Preparing your experience with care...",
  "This loading time is sponsored by patience",
  "Taking a moment to gather the best for you",
  "Excellence is worth the wait",
  "Finding the perfect items just for you",
  "Curating quality takes a moment",
  "Your amazing products are on their way",
  "Thanks for your patience, quality incoming!"
];

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
  const [loadingQuote, setLoadingQuote] = useState("");
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Define a default fallback source for images
  const defaultFallbackSrc = "/placeholders/image-placeholder.jpg";
  
  // Optimized image URL - add cache buster parameter to prevent caching issues
  const optimizedImageUrl = imageUrl 
    ? `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cache=${Date.now()}`
    : null;

  // Random quote for loading
  useEffect(() => {
    setLoadingQuote(loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]);
  }, []);

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

  // Preload image before displaying
  useEffect(() => {
    if (optimizedImageUrl && isVisible) {
      const img = new Image();
      img.src = optimizedImageUrl;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageFailed(true);
    }
  }, [optimizedImageUrl, isVisible]);

  return (
    <div 
      className="cursor-pointer group relative overflow-hidden w-full touch-manipulation" 
      onClick={onClick}
      ref={imageRef}
    >
      <AspectRatio ratio={1} className="bg-gray-100 dark:bg-zinc-700">
        {/* Loading skeleton with quote */}
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
            <div className="z-10 px-4 text-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[90%] mx-auto line-clamp-2">
                {loadingQuote}
              </p>
            </div>
          </div>
        )}
        
        {/* Main image - only load when in viewport */}
        {optimizedImageUrl && isVisible ? (
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
        ) : null}
        
        {/* Fallback for failed images */}
        {imageFailed && (
          <ImageFallback 
            src={defaultFallbackSrc}
            alt={title} 
            className="w-full h-full object-cover" 
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
