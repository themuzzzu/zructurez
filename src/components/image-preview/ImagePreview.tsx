
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageFallback } from "../ui/image-fallback";

interface ImagePreviewProps {
  src: string | null;
  alt?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "wide" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onClick?: () => void;
  allowFullscreen?: boolean;
}

export function ImagePreview({
  src,
  alt = "Image",
  className,
  aspectRatio = "square",
  objectFit = "cover",
  onClick,
  allowFullscreen = true,
}: ImagePreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    wide: "aspect-[16/9]",
    auto: "",
  };

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  const handleImageClick = () => {
    if (allowFullscreen) {
      setIsPreviewOpen(true);
    }
    onClick?.();
  };

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-md bg-muted relative group",
          aspectRatioClasses[aspectRatio],
          className
        )}
      >
        <ImageFallback
          src={src ?? ""}
          alt={alt}
          className={cn(
            "h-full w-full transition-all duration-300 group-hover:scale-105",
            objectFitClasses[objectFit]
          )}
          onClick={handleImageClick}
        />
        {allowFullscreen && src && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">Click to view</span>
          </div>
        )}
      </div>

      {allowFullscreen && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl w-full p-0 h-auto overflow-hidden bg-black/90">
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-white z-10 bg-black/40 hover:bg-black/60"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={src ?? ""}
                alt={alt}
                className="max-h-[85vh] max-w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
