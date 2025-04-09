
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <ProductImageCarousel 
          images={allImages} 
          aspectRatio={4/3}
          fallbackImage="/placeholder-image.jpg"
        />
        {discountPercentage && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {discountPercentage}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-1 p-4 space-y-2" onClick={handleClick}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          {type === 'product' && (
            <ProductLikeButton productId={id} />
          )}
        </div>
        
        {category && (
          <Badge variant="outline" className="text-xs bg-transparent">
            {category}
          </Badge>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        {price && (
          <div className="flex items-center gap-2">
            <span className="font-bold">{price}</span>
            {originalPrice && (
              <span className="text-sm line-through text-muted-foreground">
                {originalPrice}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
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
              <ShoppingBag className="h-4 w-4" />
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
