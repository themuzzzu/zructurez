
import React, { useState } from 'react';

// Import components and other modules if needed
import { ProductsSection } from '@/components/marketplace/ProductsSection';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { RecommendedProducts } from '@/components/marketplace/RecommendedProducts';
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { SortFilter } from "@/components/marketplace/SortFilter";
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { Separator } from "@/components/ui/separator";

// Define type for sort options
type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export default function OptimizedMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  
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
      {/* Hero Banner */}
      <div className="rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Items</h1>
        <p className="text-muted-foreground mb-4">Shop from thousands of products and trusted sellers</p>
      </div>
      
      {/* Personalized Recommendations (only visible to returning users) */}
      <PersonalizedRecommendations />
      
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
    </div>
  );
}
