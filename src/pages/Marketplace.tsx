
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { CategorySection } from "@/components/marketplace/CategorySection";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const handleSearch = (term: string) => {
    navigate(`/search/marketplace?q=${encodeURIComponent(term)}`);
  };

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-lg mb-6 text-blue-100">
              Search through millions of products from trusted sellers
            </p>
            <AutocompleteSearch
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={setSearchTerm}
              onSearchSelect={handleSearch}
              className="max-w-lg"
            />
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Shop by Category Section */}
        <ShopByCategory />

        {/* Category Grid Section */}
        <CategorySection onCategorySelect={(category) => navigate(`/marketplace/category/${category}`)} />
        
        {/* New Arrivals, Trending, etc can be added here */}
      </div>
    </Layout>
  );
};

export default Marketplace;
