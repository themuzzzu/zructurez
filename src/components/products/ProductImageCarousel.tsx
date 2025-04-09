
import { useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
  className?: string;
  aspectRatio?: number;
  fallbackImage?: string;
}

export const ProductImageCarousel = ({
  images,
  className,
  aspectRatio = 1,
  fallbackImage = "/placeholder.svg"
}: ProductImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Handle the case when no images are provided
  if (!images || images.length === 0) {
    return (
      <div className={cn("overflow-hidden rounded-md", className)}>
        <AspectRatio ratio={aspectRatio}>
          <img
            src={fallbackImage}
            alt="Product"
            className="h-full w-full object-cover"
          />
        </AspectRatio>
      </div>
    );
  }
  
  // If only one image, don't show carousel controls
  if (images.length === 1) {
    return (
      <div className={cn("overflow-hidden rounded-md", className)}>
        <AspectRatio ratio={aspectRatio}>
          <img
            src={images[0]}
            alt="Product"
            className="h-full w-full object-cover"
          />
        </AspectRatio>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Carousel
        className="w-full"
        onSelect={(index) => setCurrentIndex(index)}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={aspectRatio}>
                <img
                  src={image}
                  alt={`Product view ${index + 1}`}
                  className="h-full w-full object-cover rounded-md"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      {images.length > 1 && (
        <div className="flex justify-center mt-2 gap-2">
          {images.map((image, index) => (
            <Card
              key={index}
              className={cn(
                "cursor-pointer h-16 w-16 overflow-hidden transition-all",
                currentIndex === index && "ring-2 ring-primary"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
