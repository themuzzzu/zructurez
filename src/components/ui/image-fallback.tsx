
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BlurImage } from "./blur-image";
import { incrementViewCount } from "@/utils/viewsTracking";

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
}

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc = "/placeholders/image-placeholder.jpg",
  className,
  fallbackClassName,
  onClick,
  lazyLoad = true,
  blurDataUrl,
  aspectRatio = "square",
  priority = false,
  productId,
  trackView = false,
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const imageSrc = src && !error ? src : fallbackSrc;

  // Add additional fallback options
  const handleLoad = () => {
    setHasLoaded(true);
    setIsLoading(false);
    
    // Track product view when image loads and tracking is enabled
    if (trackView && productId) {
      incrementViewCount('product', productId);
    }
  };
  
  const handleError = () => {
    console.log(`Failed to load image: ${src}, using fallback`);
    setError(true);
    setIsLoading(false);
  };

  // Pre-cache the fallback image to ensure it's available
  React.useEffect(() => {
    const img = new Image();
    img.src = fallbackSrc;
  }, [fallbackSrc]);
  
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"/>
      )}
      <BlurImage
        src={imageSrc}
        alt={alt}
        blurDataUrl={blurDataUrl}
        className={cn(className, error && fallbackClassName, 
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
        )}
        aspectRatio={aspectRatio}
        loading={lazyLoad && !priority ? "lazy" : "eager"}
        onError={handleError}
        onClick={onClick}
        priority={priority}
        onLoad={handleLoad}
      />
    </div>
  );
};
