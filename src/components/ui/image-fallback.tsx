
import React, { useState } from 'react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
  lazyLoad?: boolean;
}

export const ImageFallback = ({
  src,
  alt,
  fallbackSrc,
  className,
  lazyLoad = true,
  ...props
}: ImageFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || "Image"}
      onError={handleError}
      className={className}
      loading={lazyLoad ? "lazy" : "eager"}
      {...props}
    />
  );
};
