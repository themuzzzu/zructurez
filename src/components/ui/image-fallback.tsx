
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { BlurImage } from "./blur-image";

export interface ImageFallbackProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
  lazyLoad?: boolean;
  blurDataUrl?: string;
  aspectRatio?: "square" | "video" | "portrait" | "wide";
}

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc = "/placeholders/image-placeholder.jpg",
  className,
  fallbackClassName,
  onClick,
  lazyLoad = true,
  blurDataUrl,
  aspectRatio = "square",
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const imageSrc = src && !error ? src : fallbackSrc;
  
  return (
    <BlurImage
      src={imageSrc}
      alt={alt}
      blurDataUrl={blurDataUrl}
      className={cn(className, error && fallbackClassName)}
      aspectRatio={aspectRatio}
      loading={lazyLoad ? "lazy" : "eager"}
      onError={() => setError(true)}
      onClick={onClick}
    />
  );
};
