
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ImageFallbackProps {
  src: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  onClick?: () => void;
}

export const ImageFallback = ({
  src,
  alt = "Image",
  fallbackSrc = "/placeholders/image-placeholder.jpg",
  className,
  onClick,
}: ImageFallbackProps) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={cn(className)}
      onError={() => setError(true)}
      onClick={onClick}
    />
  );
};
