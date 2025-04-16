
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Suspense, ReactNode } from "react";
import { SkeletonCard } from "@/components/loaders";

interface MarketplaceProductSectionProps {
  title?: string;
  fallbackCount?: number;
  children: ReactNode;
  className?: string;
}

export const MarketplaceProductSection = ({ 
  title, 
  fallbackCount = 2, 
  children,
  className = ""
}: MarketplaceProductSectionProps) => {
  return (
    <div className={`mb-4 sm:mb-6 ${className}`}>
      {title && <h2 className="text-lg font-bold mb-3">{title}</h2>}
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 animate-fade-in">
          {Array.from({ length: fallbackCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
};

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

export const SectionContainer = ({ children, className = "" }: SectionContainerProps) => (
  <div className={`section-container ${className}`}>
    {children}
  </div>
);
