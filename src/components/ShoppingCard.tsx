
import React from 'react';
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductLikeButton } from "./products/ProductLikeButton";
import { ProductImageCarousel } from "./products/ProductImageCarousel";

interface ShoppingCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  price?: string;
  originalPrice?: string;
  discountPercentage?: number;
  category?: string;
  type: 'product' | 'business' | 'service';
}

export const ShoppingCard = ({
  id,
  title,
  description,
  image,
  images = [],
  price,
  originalPrice,
  discountPercentage,
  category,
  type
}: ShoppingCardProps) => {
  const navigate = useNavigate();
  
  // Combine main image with additional images, removing duplicates
  const allImages = [image, ...images].filter(Boolean).filter((value, index, self) => 
    self.indexOf(value) === index
  );

  const handleClick = () => {
    if (type === 'product') {
      navigate(`/marketplace/product/${id}`);
    } else if (type === 'business') {
      navigate(`/businesses/${id}`);
    } else if (type === 'service') {
      navigate(`/services/${id}`);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-sm h-full flex flex-col">
      <div className="relative h-36 overflow-hidden">
        <ProductImageCarousel 
          images={allImages} 
          aspectRatio={4/3}
          fallbackImage="/placeholder-image.jpg"
        />
        {discountPercentage && (
          <Badge className="absolute top-1.5 right-1.5 bg-red-500 text-xs py-0 px-1.5">
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-1 p-3 space-y-1.5" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          {type === 'product' && (
            <ProductLikeButton productId={id} size="sm" />
          )}
        </div>
        
        {category && (
          <Badge variant="outline" className="text-[9px] bg-transparent h-4 px-1">
            {category}
          </Badge>
        )}
        
        <p className="text-[11px] text-muted-foreground line-clamp-2">{description}</p>
        
        {price && (
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs">{price}</span>
            {originalPrice && (
              <span className="text-[9px] line-through text-muted-foreground">
                {originalPrice}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button 
          className="w-full gap-1.5 text-xs py-1 h-auto" 
          size="sm"
          variant={type === 'business' ? "outline" : "default"}
          onClick={(e) => {
            e.stopPropagation();
            if (type === 'product') {
              // Add to cart functionality
            } else {
              handleClick();
            }
          }}
        >
          {type === 'product' ? (
            <>
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Cart
            </>
          ) : type === 'business' ? (
            'View Business'
          ) : (
            'View Service'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
