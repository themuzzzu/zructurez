
import React from 'react';
import { cn } from '@/lib/utils';
import { GridLayoutType } from './types/ProductTypes';

interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
  gridLayout?: GridLayoutType;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  children, 
  className = "",
  gridLayout = "grid4x4"
}) => {
  const getGridClasses = () => {
    switch (gridLayout) {
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
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4";
    }
  };

  return (
    <div className={cn("grid", getGridClasses(), className)}>
      {children}
    </div>
  );
};
