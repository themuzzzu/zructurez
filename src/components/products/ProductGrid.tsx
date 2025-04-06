
import React from 'react';
import { cn } from '@/lib/utils';
import { GridLayoutType, Product } from './types/ProductTypes';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ProductCard } from './ProductCard';
import { LikeProvider } from './LikeContext';

interface ProductGridProps {
  children?: React.ReactNode;
  className?: string;
  gridLayout?: GridLayoutType;
  layout?: GridLayoutType;  // Add this alias for compatibility
  horizontalScrollOnMobile?: boolean;
  products?: Product[];
  isLoading?: boolean;
  searchQuery?: string;
  onOpenAddProductDialog?: () => void;
  onLayoutChange?: (layout: GridLayoutType) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  children, 
  className,
  gridLayout,
  layout,  // Accept layout as an alias for gridLayout
  horizontalScrollOnMobile = true,
  products,
  isLoading,
  searchQuery,
  onOpenAddProductDialog,
  onLayoutChange
}) => {
  // Use layout as a fallback if gridLayout is not provided
  const effectiveLayout = gridLayout || layout || "grid4x4";
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // If products are provided, render them as ProductCard components
  const renderProducts = () => {
    if (!products) return null;
    
    return products.map((product) => (
      <ProductCard key={product.id} product={product} layout={effectiveLayout} />
    ));
  };
  
  // If on mobile and horizontal scroll is enabled
  if (isMobile && horizontalScrollOnMobile) {
    return (
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className={cn(
          "flex flex-nowrap gap-4 min-w-max pr-4",
          className
        )}>
          {products ? renderProducts() : (
            React.Children.map(children, (child) => (
              <div className="min-w-[180px] max-w-[220px]">
                {child}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  
  // For desktop or if horizontal scroll is disabled
  const getGridClasses = () => {
    switch (effectiveLayout) {
      case "grid3x3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2 gap-4";
      case "list":
        return "grid-cols-1 gap-4";
      case "single":
        return "grid-cols-1 gap-4 max-w-3xl mx-auto";
      case "grid4x4":
      default:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
    }
  };

  return (
    <div className={cn("grid", getGridClasses(), className)}>
      {products ? renderProducts() : children}
    </div>
  );
};
