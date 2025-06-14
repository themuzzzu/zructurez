
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { MarketplaceTabs } from "@/pages/marketplace/MarketplaceTabs";
import { BrowseTabContent } from "@/pages/marketplace/BrowseTabContent";
import { CategoryTabContent } from "@/pages/marketplace/CategoryTabContent";
import { SearchTabContent } from "@/pages/marketplace/SearchTabContent";
import { DealsTabContent } from "@/pages/marketplace/DealsTabContent";
import { TrendingTabContent } from "@/pages/marketplace/TrendingTabContent";
import { MarketplaceHeader } from "@/pages/marketplace/MarketplaceHeader";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

export default function MarketplaceHub() {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setShowDiscounted(false);
    setShowUsed(false);
    setShowBranded(false);
    setSortOption("newest");
    setPriceRange("all");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setActiveTab("categories");
  };

  const handleSearchSelect = (term: string) => {
    setSearchTerm(term);
    setActiveTab("search");
  };

  return (
    <Layout>
      <div className="container max-w-[1400px] mx-auto px-4 py-6">
        <MarketplaceHeader
          onSearch={handleSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearching={isSearching}
        />
        
        <MarketplaceTabs activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === "browse" && (
            <BrowseTabContent
              onCategorySelect={handleCategorySelect}
              onSearchSelect={handleSearchSelect}
            />
          )}
          
          {activeTab === "categories" && (
            <CategoryTabContent
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showDiscounted={showDiscounted}
              setShowDiscounted={setShowDiscounted}
              showUsed={showUsed}
              setShowUsed={setShowUsed}
              showBranded={showBranded}
              setShowBranded={setShowBranded}
              sortOption={sortOption}
              setSortOption={setSortOption}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              gridLayout={gridLayout}
            />
          )}
          
          {activeTab === "search" && (
            <SearchTabContent
              searchQuery={searchTerm}
              selectedCategory={selectedCategory}
              showDiscounted={showDiscounted}
              setShowDiscounted={setShowDiscounted}
              showUsed={showUsed}
              setShowUsed={setShowUsed}
              showBranded={showBranded}
              setShowBranded={setShowBranded}
              sortOption={sortOption}
              setSortOption={setSortOption}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              gridLayout={gridLayout}
            />
          )}
          
          {activeTab === "deals" && (
            <DealsTabContent />
          )}
          
          {activeTab === "trending" && (
            <TrendingTabContent />
          )}
        </MarketplaceTabs>
      </div>
    </Layout>
  );
}
