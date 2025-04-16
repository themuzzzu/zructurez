
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getOptimalImageFormat, getOptimalImageSize } from "@/utils/optimizedImageLoader";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  loadingStrategy?: 'eager' | 'lazy' | 'progressive';
  placeholderColor?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  onLoad,
  loadingStrategy = 'progressive',
  placeholderColor = "bg-muted"
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(priority);
  const [imageSize, setImageSize] = useState<string | null>(null);
  
  // Generate a safe ID from the src
  const safeId = `img-${src.replace(/\W+/g, '-').substring(0, 20)}`;
  
  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (loaded || priority || loadingStrategy === 'eager') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: "300px" // Load images when they're within 300px of viewport
      }
    );

    const currentRef = document.getElementById(safeId);
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, loaded, priority, safeId, loadingStrategy]);

  // Calculate optimal image dimensions based on container size
  useEffect(() => {
    if (!inView) return;
    
    const calculateSize = () => {
      const container = document.getElementById(safeId);
      if (container) {
        const containerWidth = container.clientWidth || 300; // Default fallback
        const optimalSize = getOptimalImageSize(containerWidth);
        const optimalFormat = getOptimalImageFormat();
        
        // Don't apply optimization to external URLs that don't support it
        if (src.startsWith('http') && !src.includes('lovable-uploads')) {
          setImageSize(src);
          return;
        }
        
        // Strip existing query parameters if any
        const baseUrl = src.split('?')[0];
        setImageSize(`${baseUrl}?w=${optimalSize}&fmt=${optimalFormat}&q=80`);
      }
    };

    calculateSize();
    
    // Recalculate on resize
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [inView, src, safeId]);

  // Handle image loading
  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center text-center ${placeholderColor} ${className}`}
           style={{ width, height }}>
        <span className="text-muted-foreground text-xs p-2">Failed to load image</span>
      </div>
    );
  }

  return (
    <div id={safeId} className={`relative ${className || ""}`} style={{ width, height }}>
      {!loaded && <Skeleton className={`absolute inset-0 ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />}
      
      {(inView || priority || loadingStrategy === 'eager') && imageSize && (
        <img 
          src={imageSize} 
          alt={alt} 
          className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover`}
          width={width} 
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={() => setError(true)}
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
    </div>
  );
}

export default OptimizedImage;
