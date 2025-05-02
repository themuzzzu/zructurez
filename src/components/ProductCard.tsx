
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Service } from "@/types/service";

interface ProductCardProps {
  product: Service;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { title, description, price, image_url, imageUrl, category } = product;
  const imageSource = image_url || imageUrl;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        {imageSource ? (
          <img
            src={imageSource}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold">{title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{description}</p>
        {category && (
          <Badge variant="outline" className="mb-2">
            {category}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-gray-50 p-4">
        <span className="text-lg font-bold">${price.toFixed(2)}</span>
        <button className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90">
          View Details
        </button>
      </CardFooter>
    </Card>
  );
};
