
import React from 'react';
import { cn } from '@/lib/utils';
import { GridLayoutType } from './types/ProductTypes';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
  gridLayout?: GridLayoutType;
  horizontalScrollOnMobile?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  children, 
  className,
  gridLayout = "grid4x4",
  horizontalScrollOnMobile = true
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // If on mobile and horizontal scroll is enabled
  if (isMobile && horizontalScrollOnMobile) {
    return (
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className={cn(
          "flex flex-nowrap gap-4 min-w-max pr-4",
          className
        )}>
          {React.Children.map(children, (child) => (
            <div className="min-w-[180px] max-w-[220px]">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // For desktop or if horizontal scroll is disabled
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
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
    }
  };

  return (
    <div className={cn("grid", getGridClasses(), className)}>
      {children}
    </div>
  );
};
