
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
  const [currentSrc, setCurrentSrc] = useState(priority ? src : (blurDataUrl || ""));
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Create small base64 placeholder if not provided
  const placeholder = blurDataUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOYvBQAAAABJRU5ErkJggg==';
  
  // Immediately set up image preloading for priority images
  useEffect(() => {
    // For priority images, preload immediately
    if (priority) {
      setIsLoading(false);
      setCurrentSrc(src);
      
      // Add preload link for priority images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
    
    // For non-priority images, use Intersection Observer
    setCurrentSrc(placeholder);
    
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
      rootMargin: "300px", // Increased from 200px - load images further before they enter viewport
      threshold: 0.01
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
      "overflow-hidden relative bg-muted/20",
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
        src={currentSrc || placeholder}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
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
