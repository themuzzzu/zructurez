
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getOptimalImageFormat, getOptimalImageSize } from "@/utils/optimizedImageLoader";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide" | "auto";
  fill?: boolean;
  priority?: boolean;
  loading?: "eager" | "lazy";
}

export function OptimizedImage({
  src,
  alt,
  className,
  aspectRatio = "auto",
  fill = false,
  priority = false,
  loading: loadingProp,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Process image URL to use optimal format and size if it's our own image
  const [processedSrc, setProcessedSrc] = useState(src);
  
  useEffect(() => {
    // Only process URLs that are from our own domain/CDN
    if (src && (src.startsWith('/') || src.includes('lovable-uploads'))) {
      const format = getOptimalImageFormat();
      
      // Get container width for responsive sizing
      const containerWidth = containerRef.current?.clientWidth || 300;
      const optimalWidth = getOptimalImageSize(containerWidth);
      
      // Create optimized URL
      const optimizedUrl = `${src}?w=${optimalWidth}&fmt=${format}&q=85`;
      setProcessedSrc(optimizedUrl);
    } else {
      setProcessedSrc(src);
    }
  }, [src]);
  
  // Calculate aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[16/9]",
    auto: "",
  };
  
  // Determine loading strategy
  const loading = priority ? "eager" : (loadingProp || "lazy");
  
  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (loading === "lazy" && imgRef.current && !loaded && !error) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Start loading the image
              if (imgRef.current) {
                imgRef.current.src = processedSrc;
              }
              observer.disconnect();
            }
          });
        },
        { rootMargin: "300px" } // Load images when they are within 300px of viewport
      );
      
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [processedSrc, loading, loaded, error]);
  
  // Priority images should be preloaded
  useEffect(() => {
    if (priority) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = processedSrc;
      link.fetchPriority = "high";
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [processedSrc, priority]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "overflow-hidden bg-muted/20 relative",
        !fill && aspectRatioClass[aspectRatio],
        className
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={loading === "eager" ? processedSrc : (priority ? processedSrc : "")}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          fill && "absolute inset-0"
        )}
        loading={loading}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true); // Stop showing loading state
        }}
        {...props}
      />
      
      {/* Fallback for error loading image */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground">
          <span className="text-xs">{alt || "Image not available"}</span>
        </div>
      )}
    </div>
  );
}
