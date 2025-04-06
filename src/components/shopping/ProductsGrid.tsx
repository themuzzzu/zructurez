
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Plus, ImageOff } from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useEffect } from "react";
import { LikeProvider } from "@/components/products/LikeContext";

interface ProductsGridProps {
  products: any[] | null;
  isLoading: boolean;
  onOpenAddProductDialog?: () => void;
  layout?: GridLayoutType;
  onLayoutChange?: (layout: GridLayoutType) => void;
  searchQuery?: string;
}

// Rename the component to ProductGrid to match expected imports
export const ProductGrid = ({ 
  products, 
  isLoading, 
  onOpenAddProductDialog,
  layout = "grid4x4",
  onLayoutChange,
  searchQuery = ""
}: ProductsGridProps) => {
  // Log when layout changes
  useEffect(() => {
    console.log("ProductsGrid using layout:", layout);
  }, [layout]);
  
  // Generate responsive grid classes based on layout
  const getGridClasses = () => {
    switch (layout) {
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4";
      case "list":
        return "flex flex-col gap-3";
      case "grid3x3":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
      case "single":
        return "grid grid-cols-1 gap-4 max-w-3xl mx-auto";
      case "grid1x1":
        return "grid grid-cols-1 gap-4";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";
    }
  };
  
  if (isLoading) {
    return (
      <div className={getGridClasses()}>
        {[...Array(layout === "list" || layout === "single" ? 4 : 8)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ImageOff className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-1 mb-6">
          {searchQuery 
            ? `No products matching "${searchQuery}"` 
            : "There are no products matching your criteria"
          }
        </p>
        {onOpenAddProductDialog && (
          <Button onClick={onOpenAddProductDialog} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <LikeProvider>
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            layout={layout}
          />
        ))}
      </div>
    </LikeProvider>
  );
};

// Export for backward compatibility
export { ProductGrid as ProductsGrid };
