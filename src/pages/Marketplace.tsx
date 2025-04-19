
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { MarketplaceProvider } from "@/providers/MarketplaceProvider";
import { MarketplaceSkeleton } from "@/components/marketplace/MarketplaceSkeleton";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { BrowseTabContent } from "@/components/marketplace/BrowseTabContent";
import { MarketplaceSearch } from "@/components/marketplace/MarketplaceSearch";
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
      <div className="container max-w-7xl mx-auto pb-16">
        <MarketplaceProvider>
          {/* 1. Search Bar (Sticky) */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="px-4 py-3">
              <MarketplaceSearch 
                onSearch={handleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
          
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
        </MarketplaceProvider>
      </div>
    </Layout>
  );
};

export default Marketplace;
