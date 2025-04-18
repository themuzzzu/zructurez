
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading-spinner";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  priority?: boolean; // Added this property to fix the TypeScript error
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.png",
  priority = false, // Added default value
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
