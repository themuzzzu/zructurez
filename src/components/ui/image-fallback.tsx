
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BlurImage } from "./blur-image";
import { incrementViewCount } from "@/utils/viewsTracking";
import { useEffect } from "react";

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
  retryCount?: number;
  maxRetries?: number;
  onLoad?: () => void;
}

// Create a default placeholder image
const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80";

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  fallbackClassName,
  onClick,
  lazyLoad = true,
  blurDataUrl,
  aspectRatio = "square",
  priority = false,
  productId,
  trackView = false,
  retryCount = 0,
  maxRetries = 2,
  onLoad,
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentRetry, setCurrentRetry] = useState(retryCount);
  
  // Check for valid image URL
  const isValidUrl = (url?: string) => {
    if (!url) return false;
    
    // Skip URLs with placeholders that don't exist
    if (url.includes('via.placeholder.com')) return false;
    
    return true;
  };
  
  // Assign appropriate image source (original, retry URL, or fallback)
  const determineImageSrc = () => {
    if (error || !isValidUrl(src)) {
      return isValidUrl(fallbackSrc) ? fallbackSrc : DEFAULT_FALLBACK;
    }
    
    // Add cache-busting parameter if retrying
    if (currentRetry > 0 && src) {
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}_retry=${currentRetry}`;
    }
    
    return src;
  };
  
  const imageSrc = determineImageSrc();

  const handleError = () => {
    console.log(`Image error for src: ${src}, retry: ${currentRetry}`);
    
    // If we haven't exceeded max retries, try again
    if (currentRetry < maxRetries) {
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
