
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export function ImageFallback({ 
  src, 
  alt, 
  className,
  fallbackClassName,
  ...props 
}: ImageFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-muted rounded-md", 
        className,
        fallbackClassName
      )}>
        <ImageOff className="h-8 w-8 text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-2">{alt || "Image not available"}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
