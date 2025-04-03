import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { LikeProvider } from "@/components/products/LikeContext";

interface ServiceProductCardProps {
  product: any;
  onAddToCart: () => void;
  type: 'service' | 'marketplace';
}

export const ServiceProductCard = ({ product, onAddToCart, type }: ServiceProductCardProps) => {
  const hasMultipleImages = type === 'service' 
    ? product.service_product_images?.length > 0 
    : product.product_images?.length > 0;
  
  const images = type === 'service' 
    ? product.service_product_images 
    : product.product_images;
  
  const name = type === 'service' ? product.name : product.title;
  const description = product.description;
  const price = product.price;
  const mainImage = type === 'service' ? product.image_url : product.image_url;

  return (
    <LikeProvider>
      <Card className="p-4 space-y-2">
        {hasMultipleImages ? (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image: any, index: number) => (
                <CarouselItem key={index}>
                  <img
                    src={image.image_url}
                    alt={`${name} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          mainImage && (
            <img
              src={mainImage}
              alt={name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )
        )}
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{name}</h3>
          {type === 'marketplace' && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Marketplace
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">₹{price}</span>
          <Button
            onClick={onAddToCart}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Card>
    </LikeProvider>
  );
};
