
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function LazyImage({ src, alt, className, width, height }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-xs">Failed to load image</span>
      </div>
    );
  }

  return loaded ? (
    <img src={src} alt={alt} className={className} width={width} height={height} />
  ) : (
    <Skeleton className={className || `w-${width || 'full'} h-${height || 'full'}`} />
  );
}

export default LazyImage;
