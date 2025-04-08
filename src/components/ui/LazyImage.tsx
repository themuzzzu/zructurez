
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

  // Generate a safe ID from the src
  const safeId = src.replace(/\W+/g, '-');

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
      { threshold: 0.1, rootMargin: "200px" } // Increased rootMargin for earlier loading
    );

    const currentRef = document.getElementById(`lazy-image-${safeId}`);
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, loaded, priority, safeId]);

  useEffect(() => {
    if (!inView) return;

    const img = new Image();
    img.src = src;
    
    // Add loading event listener
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);

    // Preload with higher priority for critical images
    if (priority) {
      img.fetchPriority = 'high';
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, inView, priority]);

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-xs">Failed to load image</span>
      </div>
    );
  }

  return (
    <div id={`lazy-image-${safeId}`} className={`relative ${className}`}>
      {!loaded && <Skeleton className={className || `w-full h-full`} />}
      {(loaded || inView) && (
        <img 
          src={src} 
          alt={alt} 
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} 
          width={width} 
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default LazyImage;
