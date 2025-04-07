
import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { GridLayoutType } from "./types/ProductTypes";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Grid3X3, Grid2X2, LayoutList } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { Progress } from "@/components/ui/progress";

export interface ProductsGridProps {
  products: Product[] | any[];
  layout?: GridLayoutType;
  isLoading?: boolean;
  onOpenAddProductDialog?: () => void;
  searchQuery?: string;
  onLayoutChange?: (layout: GridLayoutType) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
}

export const ProductsGrid = ({ 
  products, 
  layout = "grid3x3",
  isLoading = false,
  onOpenAddProductDialog,
  searchQuery,
  onLayoutChange,
  hasMore,
  onLoadMore,
  loadMoreRef
}: ProductsGridProps) => {
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [currentLayout, setCurrentLayout] = useState<GridLayoutType>(layout);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (products && products.length > 0) {
      setVisibleProducts(products);
      
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 150);
      
      return () => clearTimeout(timer);
    } else {
      setIsInitialLoad(false);
    }
  }, [products]);
  
  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout]);
  
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = Math.min(prev + 5, 95);
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
      const timer = setTimeout(() => setLoadingProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  const handleLayoutChange = (value: string) => {
    if (value === "grid2x2" || value === "grid3x3" || value === "grid4x4" || value === "list" || value === "single") {
      setCurrentLayout(value as GridLayoutType);
      if (onLayoutChange) {
        onLayoutChange(value as GridLayoutType);
      }
    }
  };
  
  // Helper function for empty state
  const renderEmptyState = () => {
    if (searchQuery) {
      return (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
            <Grid3X3 className="h-8 w-8 text-muted-foreground opacity-40" />
          </div>
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any products matching "{searchQuery}"
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      );
    }
    
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No products found</p>
        {onOpenAddProductDialog && (
          <Button onClick={onOpenAddProductDialog}>Add Your Product</Button>
        )}
      </div>
    );
  };

  // Calculate grid layout classes based on current layout
  const gridLayoutClass = {
    grid2x2: "grid-cols-1 sm:grid-cols-2 gap-4",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
    grid4x4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
    list: "flex flex-col gap-3",
    single: "grid-cols-1 gap-4 max-w-3xl mx-auto"
  };

  if (!products || products.length === 0) {
    return renderEmptyState();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3 mr-1">
        <div className={`w-40 transition-opacity ${loadingProgress > 0 ? 'opacity-100' : 'opacity-0'}`}>
          <Progress value={loadingProgress} className="h-1" />
        </div>
        
        <ToggleGroup type="single" value={currentLayout} onValueChange={handleLayoutChange}>
          <ToggleGroupItem value="grid4x4">
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid2x2">
            <Grid2X2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {isLoading ? (
        <div className={`grid ${gridLayoutClass[currentLayout]}`}>
          {Array.from({ length: currentLayout === "single" ? 1 : currentLayout === "list" ? 4 : 8 }).map((_, i) => (
            <ShoppingCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className={`grid ${gridLayoutClass[currentLayout]}`}>
          <AnimatePresence mode="wait">
            {visibleProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard 
                  product={product} 
                  layout={currentLayout}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Load more button/indicator if needed */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8" ref={loadMoreRef}>
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            className="min-w-[200px]"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
