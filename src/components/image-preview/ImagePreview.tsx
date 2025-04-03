
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface ImagePreviewProps {
  imageUrl: string | null;
  altText?: string;
  className?: string;
  thumbnailClassName?: string;
  showThumbnail?: boolean;
  thumbnailSize?: number;
  aspectRatio?: string;
  objectFit?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrl,
  altText = 'Preview image',
  className = '',
  thumbnailClassName = '',
  showThumbnail = true,
  thumbnailSize = 100,
  aspectRatio = 'auto',
  objectFit = 'cover',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!imageUrl) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {showThumbnail ? (
          <div
            className={`cursor-pointer overflow-hidden rounded-md ${thumbnailClassName}`}
            style={{ 
              width: thumbnailSize, 
              height: thumbnailSize,
              aspectRatio: aspectRatio
            }}
          >
            <img
              src={imageUrl}
              alt={altText}
              className="h-full w-full transition-transform hover:scale-105"
              style={{ objectFit }}
            />
          </div>
        ) : (
          <Button variant="ghost">View Image</Button>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-3xl">
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 rounded-full p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={imageUrl}
            alt={altText}
            className={`max-h-[80vh] w-auto ${className}`}
            onClick={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
