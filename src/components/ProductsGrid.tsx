
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Plus, ImageOff, ArrowRight } from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useEffect } from "react";
import { LikeProvider } from "@/components/products/LikeContext";
import { useNavigate } from "react-router-dom";

interface ProductsGridProps {
  products: any[] | null;
  isLoading: boolean;
  onOpenAddProductDialog?: () => void;
  layout?: GridLayoutType;
  onLayoutChange?: (layout: GridLayoutType) => void;
  searchQuery?: string;
  categoryFilter?: string;
  title?: string;
  viewAllUrl?: string;
  gridLayout?: GridLayoutType;
}

export const ProductsGrid = ({ 
  products, 
  isLoading, 
  onOpenAddProductDialog,
  layout = "grid4x4",
  gridLayout,
  onLayoutChange,
  searchQuery = "",
  categoryFilter,
  title,
  viewAllUrl
}: ProductsGridProps) => {
  const navigate = useNavigate();
  
  // Use gridLayout if provided, otherwise use layout
  const currentLayout = gridLayout || layout;
  
  // Log when layout changes
  useEffect(() => {
    console.log("ProductsGrid using layout:", currentLayout);
  }, [currentLayout]);
  
  // Generate responsive grid classes based on layout
  const getGridClasses = () => {
    switch (currentLayout) {
      case "grid4x4":
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3";
      case "list":
        return "flex flex-col gap-2 sm:gap-3";
      case "grid3x3":
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3";
      case "single":
        return "grid grid-cols-1 gap-3 max-w-2xl mx-auto";
      case "grid1x1":
        return "grid grid-cols-1 gap-3";
      default:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3";
    }
  };
  
  if (isLoading) {
    return (
      <div className={getGridClasses()}>
        {[...Array(currentLayout === "list" || currentLayout === "single" ? 3 : 6)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-2 space-y-1.5">
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ImageOff className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-base font-medium">No products found</h3>
        <p className="text-muted-foreground text-sm mt-1 mb-5">
          {searchQuery 
            ? `No products matching "${searchQuery}"` 
            : categoryFilter
              ? `No products found in ${categoryFilter}`
              : "There are no products matching your criteria"
          }
        </p>
        {onOpenAddProductDialog && (
          <Button onClick={onOpenAddProductDialog} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <LikeProvider>
      <div className="space-y-4">
        {title && viewAllUrl && (
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-base">{title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary flex items-center gap-1"
              onClick={() => navigate(viewAllUrl)}
            >
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <div className={getGridClasses()}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              layout={currentLayout}
            />
          ))}
        </div>
      </div>
    </LikeProvider>
  );
};
