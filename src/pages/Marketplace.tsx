
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { CategorySection } from "@/components/marketplace/CategorySection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { SuggestedProducts } from "@/components/marketplace/SuggestedProducts";
import { TrendingSection } from "@/components/marketplace/TrendingSection";
import { BrowseCategoriesFooter } from "@/components/marketplace/BrowseCategoriesFooter";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();
  
  const handleCategorySelect = (category: string) => {
    navigate(`/marketplace/category/${category}`);
  };
  
  const handleSearch = (term: string) => {
    navigate(`/search/marketplace?q=${encodeURIComponent(term)}`);
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <MarketplaceHero onCategorySelect={handleCategorySelect} onSearch={handleSearch} />
        
        <CategorySection onCategorySelect={handleCategorySelect} />
        
        <SponsoredProducts />
        
        <SuggestedProducts />
        
        <TrendingSection />
        
        <BrowseCategoriesFooter />
      </div>
    </Layout>
  );
};

export default Marketplace;
