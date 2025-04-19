
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Shimmer } from "./shimmer";
import { getOptimalImageWidth, optimizeImageUrl } from "@/utils/imageLoader";

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create small base64 placeholder if not provided
  const placeholder = blurDataUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOYvBQAAAABJRU5ErkJggg==';
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const width = getOptimalImageWidth(containerRef.current.offsetWidth);
    const optimizedSrc = optimizeImageUrl(src, width);
    
    if (priority) {
      setCurrentSrc(optimizedSrc);
      setIsLoading(false);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = optimizedSrc;
            img.onload = () => {
              setCurrentSrc(optimizedSrc);
              setIsLoading(false);
              observer.disconnect();
            };
          }
        });
      },
      { rootMargin: '300px', threshold: 0.01 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src, priority, blurDataUrl]);
  
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/9]",
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "overflow-hidden relative bg-muted/20",
        !fill && aspectRatioClass[aspectRatio],
        containerClassName
      )}
    >
      {isLoading && (
        <Shimmer className="absolute inset-0 z-10" />
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
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
