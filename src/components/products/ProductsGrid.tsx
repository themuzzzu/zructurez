
import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { GridLayoutType } from "./types/layouts";
import { Product } from "@/types/product";
import { Spinner } from "@/components/common/Spinner";
import { EmptySearchResults } from "@/components/marketplace/EmptySearchResults";
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
      
      // Faster loading time - reduced from 300ms to 150ms
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
  
  // Loading animation effect
  useEffect(() => {
    if (isLoading || isInitialLoad) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = Math.min(prev + 15, 99);
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading, isInitialLoad]);
  
  const handleLayoutChange = (value: string) => {
    if (value === "grid2x2" || value === "grid3x3" || value === "grid4x4" || value === "list") {
      setCurrentLayout(value as GridLayoutType);
      if (onLayoutChange) {
        onLayoutChange(value as GridLayoutType);
      }
    }
  };
  
  if (isLoading || isInitialLoad) {
    const gridLayoutClass = {
      grid2x2: "grid-cols-1 sm:grid-cols-2 gap-4",
      grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
      grid4x4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
      list: "grid-cols-1 gap-3"
    };
    
    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="w-40">
            <Progress value={loadingProgress} className="h-1" />
          </div>
          
          <div className="flex justify-end mr-1">
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
        </div>
        
        <div className={`grid ${gridLayoutClass[currentLayout]}`}>
          {Array(8).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <ShoppingCardSkeleton />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return searchQuery ? (
      <EmptySearchResults searchTerm={searchQuery} />
    ) : (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No products found</p>
        {onOpenAddProductDialog && (
          <Button onClick={onOpenAddProductDialog}>Add Your Product</Button>
        )}
      </div>
    );
  }

  const gridLayoutClass = {
    grid2x2: "grid-cols-1 sm:grid-cols-2 gap-4",
    grid3x3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
    grid4x4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
    list: "flex flex-col gap-3"
  };

  return (
    <div>
      <div className="flex justify-end mb-3 mr-1">
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
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentLayout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`grid ${gridLayoutClass[currentLayout]}`}
        >
          {visibleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <ProductCard 
                key={product.id} 
                product={product} 
                layout={currentLayout}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button onClick={onLoadMore} variant="outline" ref={loadMoreRef}>
            {isLoading ? <Spinner size="sm" /> : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};
