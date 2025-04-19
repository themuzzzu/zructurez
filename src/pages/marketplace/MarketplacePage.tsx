import React, { useState, useEffect } from "react";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { useNavigate } from "react-router-dom";

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
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
        {/* Search bar */}
        <div data-section="search">
          <AutocompleteSearch
            value={searchTerm}
            onChange={setSearchTerm}
            onSearchSelect={handleSearch}
            placeholder="Search for products, services, or businesses..."
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
        
        {/* Removed sections:
          - MarketplaceHeader
          - SponsoredProducts
          - FlashSale
          - SuggestedProducts
          - TrendingProducts
          - TrendingSection
          - CategoryFeatured
          - TrendingSearches
          - BrowseCategoriesFooter
        */}
      </div>
    </MarketplaceLayout>
  );
}
