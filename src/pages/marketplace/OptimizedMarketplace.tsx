
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { BrowseTabContent } from "./BrowseTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";

const OptimizedMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setActiveTab("category");
  };

  const handleSearchSelect = (term: string) => {
    setSearchQuery(term);
    setActiveTab("search");
  };

  const resetFilters = () => {
    setShowDiscounted(false);
    setShowUsed(false);
    setShowBranded(false);
    setSortOption("newest");
    setPriceRange("all");
  };

  return (
    <div className="container px-4 mx-auto max-w-screen-xl py-4 pb-16">
      {/* Display the banner carousel at the top of the page */}
      <div className="mb-8">
        <BannerCarousel />
      </div>

      <MarketplaceHeader 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        cartItemCount={0} // You can replace this with actual cart count
      />

      <Tabs
        defaultValue="browse"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-0">
          <BrowseTabContent 
            handleCategorySelect={handleCategorySelect}
            handleSearchSelect={handleSearchSelect}
          />
        </TabsContent>

        <TabsContent value="category" className="mt-0">
          <CategoryTabContent 
            setSelectedCategory={setSelectedCategory}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <SearchTabContent 
            searchQuery={searchQuery}
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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizedMarketplace;
