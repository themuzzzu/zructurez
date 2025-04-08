
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "./card"
import { AspectRatio } from "./aspect-ratio"
import { Skeleton } from "./skeleton"

const BusinessCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full h-full bg-black text-white flex flex-col hover:scale-[1.01]",
      className
    )}
    {...props}
  />
))
BusinessCard.displayName = "BusinessCard"

const BusinessCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src: string, alt: string, priority?: boolean }
>(({ className, src, alt, priority = false, ...props }, ref) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    // Reset image state when src changes
    setIsLoaded(false);
    setHasError(false);
    
    // Preload image if priority is true
    if (priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
    }
  }, [src, priority]);

  return (
    <div className="relative w-full">
      <AspectRatio 
        ratio={16/9} 
        className={cn("bg-muted overflow-hidden", className)} 
        {...props}
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}
        {src && (
          <img 
            src={src || '/placeholder.svg'} 
            alt={alt} 
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            ref={imgRef}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              setHasError(true);
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
              setIsLoaded(true);
            }}
          />
        )}
      </AspectRatio>
    </div>
  );
})
BusinessCardImage.displayName = "BusinessCardImage"

const BusinessCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 space-y-3 flex-1 flex flex-col z-10 relative", className)}
    {...props}
  />
))
BusinessCardContent.displayName = "BusinessCardContent"

export { BusinessCard, BusinessCardImage, BusinessCardContent }
