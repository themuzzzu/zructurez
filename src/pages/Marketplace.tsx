
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { MarketplaceProvider } from "@/providers/MarketplaceProvider";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { BrowseTabContent } from "@/components/marketplace/BrowseTabContent";
import { SuggestedProducts } from "@/components/marketplace/SuggestedProducts";

const Marketplace = () => {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  if (params.productId) {
    return <NotFound />;
  }
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  return (
    <Layout>
      <MarketplaceProvider>
        {/* 1. Search Bar (Sticky) */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container max-w-7xl mx-auto px-4 py-3">
            <MarketplaceSearch 
              onSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto pb-16">
          <div className="space-y-6 px-4 pt-4">
            {/* 2. Banner Carousel */}
            <div className="overflow-hidden rounded-2xl">
              <BannerCarousel />
            </div>
            
            {/* 3. Shop by Category */}
            <div className="mt-8">
              <ShopByCategory onCategorySelect={handleCategorySelect} />
            </div>
            
            {/* 4. Sponsored Products */}
            <div className="mt-8">
              <SponsoredProducts />
            </div>
            
            {/* 5. Suggested Products */}
            <div className="mt-8">
              <SuggestedProducts />
            </div>
            
            {/* 6. Trending Products */}
            <div className="mt-8">
              <TrendingProducts />
            </div>
            
            {/* 7. Browse by Category */}
            <div className="mt-10 mb-8">
              <BrowseTabContent 
                searchTerm={searchTerm}
                onCategorySelect={handleCategorySelect} 
              />
            </div>
          </div>
        </div>
      </MarketplaceProvider>
    </Layout>
  );
};

export default Marketplace;
