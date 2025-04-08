
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BlurImage } from "./blur-image";

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
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Reset error state if src changes
  useEffect(() => {
    setError(false);
    setIsLoaded(false);
    
    // Preload image if priority is true
    if (priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, priority]);
  
  const imageSrc = src && !error ? src : fallbackSrc;
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
      <BlurImage
        src={imageSrc}
        alt={alt}
        blurDataUrl={blurDataUrl}
        className={cn(
          "transition-opacity duration-300", 
          isLoaded ? "opacity-100" : "opacity-0",
          error && fallbackClassName
        )}
        aspectRatio={aspectRatio}
        loading={priority ? "eager" : (lazyLoad ? "lazy" : "eager")}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
      />
    </div>
  );
};
