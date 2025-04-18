
import { cn } from '@/lib/utils';
import { GridLayoutType } from './types/ProductTypes';
import { ReactNode } from 'react';

interface ProductGridProps {
  children: ReactNode;
  gridLayout?: GridLayoutType;
  className?: string;
  testId?: string; // Added for testing purposes
}

export function ProductGrid({ 
  children, 
  gridLayout = "grid4x4",
  className,
  testId = "product-grid" // Default value
}: ProductGridProps) {
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid1x1":
        return "grid-cols-1 gap-4";
      case "grid2x2":
        return "grid-cols-1 sm:grid-cols-2 gap-4";
      case "grid3x3":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
      case "list":
        return "grid-cols-1 gap-4";
      default: // grid4x4
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4";
    }
  };

  return (
    <div 
      className={cn("grid", getGridClasses(), className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
