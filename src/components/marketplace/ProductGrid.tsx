
import React from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  category?: string;
  views?: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  layout?: GridLayoutType;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  layout = "grid4x4",
  emptyMessage = "No products found" 
}) => {
  const gridLayouts = {
    grid2x2: "grid-cols-1 sm:grid-cols-2",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    grid4x4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };
  
  if (loading) {
    return (
      <div className={`grid ${gridLayouts[layout]} gap-4`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-full">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="mt-2">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className={`grid ${gridLayouts[layout]} gap-4`}>
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          layout={layout}
        />
      ))}
    </div>
  );
};
