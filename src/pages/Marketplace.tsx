
import React, { Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { MarketplaceProvider } from "@/providers/MarketplaceProvider";
import { MarketplaceSkeleton } from "@/components/marketplace/MarketplaceSkeleton";
import { MarketplaceHeader } from "./marketplace/MarketplaceHeader";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { BrowseTabContent } from "@/components/marketplace/BrowseTabContent";

const Marketplace = () => {
  const params = useParams();
  
  if (params.productId) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 pt-2 sm:pt-6 pb-16">
        <MarketplaceProvider>
          <div className="space-y-6">
            {/* Search Bar */}
            <MarketplaceHeader 
              onSearch={() => {}}
              searchTerm=""
              setSearchTerm={() => {}}
            />
            
            {/* Banner Carousel */}
            <BannerCarousel />
            
            {/* Shop by Category */}
            <ShopByCategory />
            
            {/* Sponsored Products */}
            <div className="mt-8">
              <SponsoredProducts />
            </div>
            
            {/* Suggested Products */}
            <div className="mt-8">
              <TrendingProducts />
            </div>
            
            {/* Browse by Category */}
            <div className="mt-8">
              <BrowseTabContent />
            </div>
          </div>
        </MarketplaceProvider>
      </div>
    </Layout>
  );
};

export default Marketplace;
