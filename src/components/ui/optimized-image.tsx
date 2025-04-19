
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.png",
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 overflow-hidden">
          <Skeleton className="w-full h-full" />
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
