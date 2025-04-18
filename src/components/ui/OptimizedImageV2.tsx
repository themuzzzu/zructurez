
import { useState, useEffect, useRef } from "react";
import { getOptimalImageWidth, optimizeImageUrl } from "@/utils/imageLoader";
import { cn } from "@/lib/utils";

interface OptimizedImageV2Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export function OptimizedImageV2({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  ...props
}: OptimizedImageV2Props) {
  const [optimizedSrc, setOptimizedSrc] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src) return;

    const updateImageSize = () => {
      if (containerRef.current) {
        const width = getOptimalImageWidth(containerRef.current.offsetWidth);
        const optimized = optimizeImageUrl(src, width);
        setOptimizedSrc(optimized);
      }
    };

    updateImageSize();
    window.addEventListener('resize', updateImageSize);
    
    return () => window.removeEventListener('resize', updateImageSize);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        className
      )}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      
      <img
        ref={imageRef}
        src={optimizedSrc || src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}
