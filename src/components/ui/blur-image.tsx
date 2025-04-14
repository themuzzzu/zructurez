
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Shimmer } from "./shimmer";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  blurDataUrl?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  fill?: boolean;
  priority?: boolean;
}

export function BlurImage({
  src,
  alt,
  blurDataUrl,
  className,
  containerClassName,
  aspectRatio = "square",
  fill = false,
  priority = false,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : (blurDataUrl || src));
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Create small base64 placeholder if not provided
  const placeholder = blurDataUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOYvBQAAAABJRU5ErkJggg==';
  
  useEffect(() => {
    // If priority is true, we don't need to lazy load
    if (priority) {
      setIsLoading(false);
      setCurrentSrc(src);
      return;
    }
    
    // Reset loading state when src changes
    setIsLoading(true);
    
    // Start with placeholder
    setCurrentSrc(placeholder);
    
    // Use Intersection Observer for better performance
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Preload the actual image
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setCurrentSrc(src);
            setIsLoading(false);
            observer.disconnect();
          };
        }
      });
    }, {
      rootMargin: "200px" // Load images 200px before they enter viewport (increased from 100px)
    });
    
    // Observe the actual image element
    if (imgRef.current) {
      imgObserver.observe(imgRef.current);
    }
    
    return () => {
      imgObserver.disconnect();
    };
  }, [src, placeholder, priority]);
  
  // Calculate aspect ratio classes
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/9]",
  };
  
  return (
    <div className={cn(
      "overflow-hidden relative",
      !fill && aspectRatioClass[aspectRatio],
      containerClassName
    )}>
      {isLoading && (
        <Shimmer 
          className={cn("absolute inset-0 z-10")} 
        />
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
          fill && "absolute inset-0",
          className
        )}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...props}
      />
    </div>
  );
}
