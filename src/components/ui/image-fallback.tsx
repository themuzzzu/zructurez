
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
  
  const imageSrc = src && !error ? src : fallbackSrc;

  const handleLoad = () => {
    setHasLoaded(true);
    
    // Track product view when image loads and tracking is enabled
    if (trackView && productId) {
      incrementViewCount('product', productId);
    }
  };
  
  return (
    <BlurImage
      src={imageSrc}
      alt={alt}
      blurDataUrl={blurDataUrl}
      className={cn(className, error && fallbackClassName)}
      aspectRatio={aspectRatio}
      loading={lazyLoad && !priority ? "lazy" : "eager"}
      onError={() => setError(true)}
      onClick={onClick}
      priority={priority}
      onLoad={handleLoad}
    />
  );
};
