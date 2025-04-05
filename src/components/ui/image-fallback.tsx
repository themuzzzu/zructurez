
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ImageFallbackProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
}

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc = "/placeholders/image-placeholder.jpg",
  className,
  fallbackClassName,
  onClick,
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Reset error state when src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  // Add cache-busting parameter to prevent cached broken images
  const imageSrc = src && !error 
    ? `${src}${src.includes('?') ? '&' : '?'}v=${Date.now()}`
    : fallbackSrc;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          error && fallbackClassName
        )}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        onClick={onClick}
        loading="lazy"
      />
    </div>
  );
};
