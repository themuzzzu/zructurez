
import React, { useState, Suspense, useEffect } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { MarketplaceHeader } from "@/components/marketplace/MarketplaceHeader";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { SuggestedProducts } from "@/components/marketplace/SuggestedProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { TrendingSection } from "@/components/marketplace/TrendingSection";
import { TrendingSearches } from "@/components/marketplace/TrendingSearches";
import { BrowseCategoriesFooter } from "@/components/marketplace/BrowseCategoriesFooter";
import { useNavigate } from "react-router-dom";

// Lazy-loaded components for better performance
const FlashSale = React.lazy(() => import("@/components/marketplace/FlashSale").then(module => ({ default: module.FlashSale })));
const CategoryFeatured = React.lazy(() => import("@/components/marketplace/CategoryFeatured").then(module => ({ default: module.CategoryFeatured })));

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3); // Mock cart item count
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    navigate(`/search/marketplace?q=${encodeURIComponent(term)}`);
  };

  // Track section views for analytics
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            console.log(`Section viewed: ${sectionName}`);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <MarketplaceLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8 space-y-6 sm:space-y-8">
        {/* Header with cart and filters */}
        <MarketplaceHeader 
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          cartItemCount={cartItemCount}
        />
        
        {/* Search bar */}
        <div data-section="search">
          <AutocompleteSearch
            value={searchTerm}
            onChange={setSearchTerm}
            onSearchSelect={handleSearch}
            placeholder="Search products, brands, and categories..."
          />
        </div>
        
        {/* Featured banners */}
        <div data-section="banner-carousel">
          <BannerCarousel />
        </div>
        
        {/* Shop by category */}
        <div data-section="categories">
          <ShopByCategory />
        </div>
        
        {/* Sponsored products */}
        <div data-section="sponsored-products">
          <SponsoredProducts />
        </div>
        
        {/* Flash sale - lazy loaded */}
        <div data-section="flash-sale">
          <Suspense fallback={<div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>}>
            <FlashSale />
          </Suspense>
        </div>
        
        {/* Suggested products */}
        <div data-section="suggested-products">
          <SuggestedProducts />
        </div>
        
        {/* Trending products */}
        <div data-section="trending-products">
          <TrendingProducts />
        </div>
        
        {/* Trending by category section */}
        <div data-section="trending-section">
          <TrendingSection />
        </div>
        
        {/* Featured category - lazy loaded */}
        <div data-section="category-featured">
          <Suspense fallback={<div className="h-48 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>}>
            <CategoryFeatured categoryName="Electronics" />
          </Suspense>
        </div>
        
        {/* Trending searches */}
        <div data-section="trending-searches">
          <TrendingSearches onSearchSelect={handleSearch} />
        </div>
        
        {/* Browse categories footer */}
        <div data-section="categories-footer">
          <BrowseCategoriesFooter />
        </div>
      </div>
    </MarketplaceLayout>
  );
}
