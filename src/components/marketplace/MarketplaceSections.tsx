
import { Suspense, lazy } from "react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { SkeletonCard } from "@/components/loaders";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";

// Lazy load components for improved performance
const BannerCarousel = lazy(() => 
  import("@/components/marketplace/BannerCarousel").then(module => ({ default: module.BannerCarousel }))
);
const SponsoredProducts = lazy(() => 
  import("@/components/marketplace/SponsoredProducts").then(module => ({ default: module.default }))
);
const SuggestedProducts = lazy(() => 
  import("@/components/products/SuggestedProducts").then(module => ({ default: module.default }))
);
const TrendingProducts = lazy(() => 
  import("@/components/marketplace/TrendingProducts").then(module => ({ default: module.TrendingProducts }))
);
const BrowseTabContent = lazy(() => 
  import("@/components/marketplace/BrowseTabContent").then(module => ({ default: module.BrowseTabContent }))
);

// Optimized section loader component
const LazySection = ({ children, fallbackCount = 2 }) => (
  <Suspense fallback={
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 animate-fade-in">
      {Array.from({ length: fallbackCount }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  }>
    {children}
  </Suspense>
);

interface MarketplaceSectionsProps {
  searchQuery: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (category: string, subcategory?: string) => void;
  gridLayout?: GridLayoutType;
}

export const MarketplaceSections = ({
  searchQuery,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  gridLayout = "grid4x4"
}: MarketplaceSectionsProps) => {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* 1. Banner Carousel - High impact visuals to engage users */}
      <LazySection fallbackCount={1}>
        <BannerCarousel />
      </LazySection>

      {/* 2. Categories - Quick access to popular categories */}
      <div className="mb-4 sm:mb-6">
        <ShopByCategory onCategorySelect={onCategoryChange} />
      </div>
      
      {/* 3. Sponsored Products - Revenue generating section */}
      <LazySection>
        <SponsoredProducts />
      </LazySection>

      {/* 4. Suggested Products - Personalized recommendations */}
      <LazySection>
        <SuggestedProducts />
      </LazySection>

      {/* 5. Trending Products - Popular items */}
      <LazySection>
        <TrendingProducts />
      </LazySection>

      {/* 6. Browse by Category - Deeper category exploration */}
      <LazySection>
        <BrowseTabContent 
          searchTerm={searchQuery}
          onCategorySelect={onCategoryChange}
        />
      </LazySection>
    </div>
  );
};
