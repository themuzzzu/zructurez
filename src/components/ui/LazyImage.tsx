
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function LazyImage({ src, alt, className, width, height, priority = false }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(priority);

  useEffect(() => {
    // Skip if already loaded or priority is true (load immediately)
    if (loaded || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = document.getElementById(`lazy-image-${src.replace(/\W+/g, '-')}`);
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, loaded, priority]);

  useEffect(() => {
    if (!inView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src, inView]);

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-xs">Failed to load image</span>
      </div>
    );
  }

  return (
    <div id={`lazy-image-${src.replace(/\W+/g, '-')}`} className={`relative ${className}`}>
      {!loaded && <Skeleton className={className || `w-full h-full`} />}
      {(loaded || inView) && (
        <img 
          src={src} 
          alt={alt} 
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} 
          width={width} 
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default LazyImage;
