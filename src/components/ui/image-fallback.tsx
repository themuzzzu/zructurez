
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BlurImage } from "./blur-image";
import { incrementViewCount } from "@/utils/viewsTracking";
import { 
  trackImageError, 
  hasExceededRetryAttempts, 
  getImageUrlWithCacheBusting, 
  isLikelyValidImageUrl,
  getFallbackImage
} from "@/utils/imageErrorTracking";

export interface ImageFallbackProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
  lazyLoad?: boolean;
  blurDataUrl?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  priority?: boolean;
  productId?: string;
  trackView?: boolean;
  contentType?: 'product' | 'service' | 'business' | 'general';
  onLoad?: () => void;
}

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc,
  className,
  fallbackClassName,
  onClick,
  lazyLoad = true,
  blurDataUrl,
  aspectRatio = "square",
  priority = false,
  productId,
  trackView = false,
  contentType = 'general',
  onLoad,
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentRetry, setCurrentRetry] = useState(0);
  
  // Use the fallbackSrc if provided, otherwise use the default for content type
  const defaultFallbackSrc = getFallbackImage(contentType);
  
  // Assign appropriate image source (original, retry URL, or fallback)
  const determineImageSrc = () => {
    // If we've had an error or the source isn't a valid image URL
    if (error || !isLikelyValidImageUrl(src)) {
      return fallbackSrc || defaultFallbackSrc;
    }
    
    // Add cache-busting parameter if retrying
    if (currentRetry > 0 && src) {
      return getImageUrlWithCacheBusting(src, currentRetry);
    }
    
    return src;
  };
  
  const imageSrc = determineImageSrc();

  const handleError = () => {
    console.log(`Image error for src: ${src}, retry: ${currentRetry}`);
    
    // Track the error and check if we should retry
    const shouldRetry = trackImageError(src);
    
    if (shouldRetry && currentRetry < 2) {
      setCurrentRetry(prev => prev + 1);
    } else {
      setError(true);
    }
  };
  
  const handleLoad = () => {
    setHasLoaded(true);
    
    // Call the onLoad callback if provided
    if (onLoad) {
      onLoad();
    }
    
    // Track product view when image loads and tracking is enabled
    if (trackView && productId) {
      incrementViewCount('product', productId);
    }
  };
  
  // Reset error state when src changes
  useEffect(() => {
    setError(false);
    setHasLoaded(false);
    setCurrentRetry(0);
  }, [src]);
  
  return (
    <BlurImage
      src={imageSrc}
      alt={alt}
      blurDataUrl={blurDataUrl}
      className={cn(className, error && fallbackClassName)}
      aspectRatio={aspectRatio}
      loading={lazyLoad && !priority ? "lazy" : "eager"}
      onError={handleError}
      onClick={onClick}
      priority={priority}
      onLoad={handleLoad}
    />
  );
};
