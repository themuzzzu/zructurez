
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductImageCarouselProps {
  images: string[];
  className?: string;
  aspectRatio?: number | string;
  fallbackImage?: string;
}

export const ProductImageCarousel = ({ 
  images, 
  className, 
  aspectRatio = 1,
  fallbackImage = "/placeholder.svg" 
}: ProductImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle when images array changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // If no images, return placeholder
  if (!images || images.length === 0) {
    return (
      <div className={cn(`relative aspect-[${aspectRatio}] w-full bg-muted`, className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      </div>
    );
  }

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Preload adjacent images
  useEffect(() => {
    if (images.length <= 1) return;
    
    // Preload next and previous images
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    
    [nextIndex, prevIndex].forEach(index => {
      const img = new Image();
      img.src = images[index];
    });
  }, [currentIndex, images]);

  return (
    <div className={cn(`relative aspect-[${aspectRatio}] w-full overflow-hidden rounded-md`, className)}>
      {/* Image */}
      <div className="relative h-full w-full">
        <OptimizedImage
          src={images[currentIndex] || fallbackImage}
          alt={`Product image ${currentIndex + 1}`}
          className="h-full w-full transition-opacity duration-300"
          priority={currentIndex === 0} // Priority load first image only
          aspectRatio="square"
        />
      </div>

      {/* Navigation arrows - only show if more than one image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm hover:bg-background/90 disabled:opacity-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm hover:bg-background/90 disabled:opacity-50"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-primary scale-110" : "bg-background/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
