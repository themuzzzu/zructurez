
import React from 'react';
import { cn } from '@/lib/utils';
import { GridLayoutType, Product } from './types/ProductTypes';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ProductCard } from './ProductCard';

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

export const ProductsGrid: React.FC<ProductGridProps> = (props) => {
  // Forward all props to ProductGrid to maintain backward compatibility
  return <ProductGrid {...props} />;
};

// Import the ProductGrid component from the new file
import { ProductGrid } from './ProductGrid';

// Re-export ProductGrid as ProductsGrid for backward compatibility
export { ProductGrid };
