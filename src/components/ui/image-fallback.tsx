
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageFallbackProps {
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  alt,
  className,
  fallbackClassName
}) => {
  return (
    <div className={cn('flex items-center justify-center bg-muted h-full w-full', className)}>
      <ImageOff className={cn('text-muted-foreground h-10 w-10', fallbackClassName)} />
      <span className="sr-only">{alt}</span>
    </div>
  );
};
