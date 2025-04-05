
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ImageFallbackProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
  lazyLoad?: boolean;
}

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc = "/placeholders/image-placeholder.jpg",
  className,
  fallbackClassName,
  onClick,
  lazyLoad = true,
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Reset error state when src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when within 200px of viewport
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [lazyLoad]);

  // Determine which source to use
  const imageSrc = isVisible ? (src && !error ? src : fallbackSrc) : fallbackSrc;

  return (
    <div className={cn("relative overflow-hidden", className)} ref={imgRef}>
      {/* Simplified skeleton loader */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      )}
      
      {isVisible && (
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
      )}
    </div>
  );
};
