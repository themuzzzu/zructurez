
import React, { useState } from 'react';
import { ProductsSection } from '@/components/marketplace/ProductsSection';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { SortFilter } from "@/components/marketplace/SortFilter";
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { Separator } from "@/components/ui/separator";
import { AutoScrollingBannerAd } from '@/components/ads/AutoScrollingBannerAd';
import { useAdBanners } from '@/hooks/useAdBanners';
import { LikeProvider } from '@/components/products/LikeContext';

// Define type for sort options
type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export const OptimizedMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const { ads: bannerAds } = useAdBanners("product", "banner", 3);
  
  // Log for debugging
  console.log("OptimizedMarketplace rendered with layout: grid4x4");
  
  // Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Auto-scrolling Banner Ad */}
      <div className="mb-8">
        <AutoScrollingBannerAd ads={bannerAds} autoScrollInterval={3000} />
      </div>
      
      {/* Personalized Recommendations (only visible to returning users) */}
      <PersonalizedRecommendations />
      
      <LikeProvider>
        {/* Sponsored Products Carousel */}
        <SponsoredProducts />
        
        {/* Category & Sort Selection */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          />
          <SortFilter 
            selectedSort={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
        
        {/* This is the main products section that will show filtered results */}
        <ProductsSection
          title="Latest Products"
          category={selectedCategory || undefined}
          sortBy={sortBy}
          limit={8}
        />
        
        <Separator className="my-8" />
        
        {/* Trending Products Section - always shows most viewed */}
        <TrendingProducts />
        
        <Separator className="my-8" />
        
        {/* Categories Sections */}
        <div className="space-y-12">
          {/* Electronics */}
          <ProductsSection
            title="Electronics"
            category="electronics"
            sortBy="newest"
            limit={4}
          />
          
          {/* Clothing */}
          <ProductsSection
            title="Fashion"
            category="clothing"
            sortBy="newest"
            limit={4}
          />
          
          {/* Home & Garden */}
          <ProductsSection
            title="Home & Garden"
            category="home"
            sortBy="popular"
            limit={4}
          />
        </div>
      </LikeProvider>
    </div>
  );
};
