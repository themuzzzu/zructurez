
import React, { useState, useEffect } from "react";
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
  onLoad?: () => void;
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
  onLoad,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(blurDataUrl || "");
  
  // Create small base64 placeholder if not provided
  const placeholder = blurDataUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOYvBQAAAABJRU5ErkJggg==';
  
  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
    
    // Start with placeholder
    setCurrentSrc(placeholder);
    
    // Preload the actual image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      if (onLoad) {
        onLoad();
      }
    };
    
    return () => {
      img.onload = null;
    };
  }, [src, placeholder, onLoad]);
  
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
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
          fill && "absolute inset-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
