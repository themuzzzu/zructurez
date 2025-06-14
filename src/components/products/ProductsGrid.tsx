
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";
import { GridLayoutType, Product } from "./types/ProductTypes";
import { cn } from "@/lib/utils";

interface ProductsGridProps {
  products: Product[];
  layout: GridLayoutType;
  isLoading: boolean;
  searchQuery?: string;
  onOpenAddProductDialog?: () => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  layout,
  isLoading,
  searchQuery = ""
}) => {
  const getGridClasses = (layout: GridLayoutType) => {
    switch (layout) {
      case "grid1x1":
        return "grid-cols-1";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2";
      case "grid3x3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case "grid4x4":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", getGridClasses(layout))}>
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
          <div className="relative aspect-square">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            
            {product.is_discounted && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                Sale
              </Badge>
            )}
            
            {product.views && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {product.views}
              </div>
            )}
          </div>
          
          <CardContent className="p-3">
            <h3 className="font-medium line-clamp-2 text-sm mb-1">{product.title}</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">₹{product.price?.toLocaleString()}</span>
              
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
            </div>
            
            {product.category && (
              <Badge variant="outline" className="mt-2 text-xs">
                {product.category}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
