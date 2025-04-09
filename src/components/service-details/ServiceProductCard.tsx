
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ProductLikeButton } from "@/components/products/ProductLikeButton";
import { ProductImageCarousel } from "@/components/products/ProductImageCarousel";

interface ServiceProductCardProps {
  product: any;
  onAddToCart: () => void;
  type: 'service' | 'marketplace';
}

export const ServiceProductCard = ({ product, onAddToCart, type }: ServiceProductCardProps) => {
  // Convert product images to array of image URLs
  const images: string[] = [];
  
  // Add main image if available
  if (product.image_url) {
    images.push(product.image_url);
  }
  
  // Add additional images if available
  if (type === 'service' && product.service_product_images?.length > 0) {
    product.service_product_images.forEach((img: any) => {
      if (img.image_url && !images.includes(img.image_url)) {
        images.push(img.image_url);
      }
    });
  } else if (type === 'marketplace' && product.product_images?.length > 0) {
    product.product_images.forEach((img: any) => {
      if (img.image_url && !images.includes(img.image_url)) {
        images.push(img.image_url);
      }
    });
  }
  
  const name = type === 'service' ? product.name : product.title;
  const description = product.description;
  const price = product.price;

  return (
    <Card className="p-4 space-y-2">
      <div className="h-48">
        <ProductImageCarousel 
          images={images} 
          aspectRatio={16/9} 
          fallbackImage="/placeholder.svg" 
        />
      </div>
      
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
        <div className="flex items-center gap-2">
          <ProductLikeButton
            productId={product.id}
            size="sm"
            variant="ghost"
          />
          <Button
            onClick={onAddToCart}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};
