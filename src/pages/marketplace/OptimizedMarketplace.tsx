
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { BrowseTabContent } from "./BrowseTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { SearchBar } from "@/components/search/SearchBar";
import { DealsSection } from "@/components/marketplace/DealsSection";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { RecommendedProducts } from "@/components/marketplace/RecommendedProducts";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";

const OptimizedMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  
  // Filter states
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  // Track if user arrived from a category selection
  const [fromCategorySelect, setFromCategorySelect] = useState(false);
  
  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo(0, 0);
  }, [activeTab]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setActiveTab("category");
    setFromCategorySelect(true);
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
    <div className="container px-4 sm:px-4 mx-auto max-w-screen-xl py-4 pb-16 overflow-x-hidden">
      {/* Main Search bar at the top */}
      <div className="mb-6 mt-4">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search products, brands and more..."
          showVoiceSearch={true}
          showImageSearch={true}
          className="w-full"
        />
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

      {/* Flash Sale Banner */}
      <div className="mb-8 mt-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl overflow-hidden shadow-md">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <Zap className="h-6 w-6 text-white mr-2 animate-pulse" />
              <h2 className="text-2xl font-bold text-white">FLASH SALE</h2>
            </div>
            <p className="text-white text-opacity-90 mb-3">Limited time offers. Up to 70% off!</p>
            <div className="flex space-x-4 text-xl font-bold text-white">
              <div className="bg-black bg-opacity-30 p-2 rounded">08</div>
              <div>:</div>
              <div className="bg-black bg-opacity-30 p-2 rounded">24</div>
              <div>:</div>
              <div className="bg-black bg-opacity-30 p-2 rounded">36</div>
            </div>
          </div>
          <Button 
            className="bg-white text-pink-600 hover:bg-gray-100 flex items-center"
            onClick={() => {
              setShowDiscounted(true);
              setActiveTab("search");
            }}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shop Now
          </Button>
        </div>
      </div>

      {/* Display the banner carousel below the search bar */}
      <div className="mb-6">
        <BannerCarousel />
      </div>

      {/* Flash Deals Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Today's Deals</h2>
          <Button 
            variant="link" 
            className="text-blue-600 dark:text-blue-400"
            onClick={() => {
              setShowDiscounted(true);
              setActiveTab("search");
            }}
          >
            See All
          </Button>
        </div>
        <DealsSection />
      </div>

      <div className="flex justify-between items-center mt-6 mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Products</h2>
        <GridLayoutSelector layout={gridLayout} onChange={setGridLayout} />
      </div>

      <Tabs
        defaultValue="browse"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full max-w-md grid grid-cols-3 mb-6 bg-zinc-100 dark:bg-zinc-800">
          <TabsTrigger 
            value="browse"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
          >
            Browse
          </TabsTrigger>
          <TabsTrigger 
            value="category"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger 
            value="search"
            className="data-[state=active]:bg-zinc-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-zinc-900"
          >
            Search Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-0">
          <BrowseTabContent 
            handleCategorySelect={handleCategorySelect}
            handleSearchSelect={handleSearchSelect}
            gridLayout={gridLayout}
          />
        </TabsContent>

        <TabsContent value="category" className="mt-0">
          <CategoryTabContent 
            setSelectedCategory={setSelectedCategory}
            setActiveTab={setActiveTab}
            gridLayout={gridLayout}
            category={selectedCategory}
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
            gridLayout={gridLayout}
          />
        </TabsContent>
      </Tabs>
      
      {/* Essentials Section - Always visible */}
      <div className="mt-10 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Daily Essentials</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {["Groceries", "Health & Personal Care", "Home Essentials", "Cleaning Supplies", "Baby Products", "Pet Supplies", "Packaged Foods", "Beverages"].map((category, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-zinc-800 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-zinc-700"
              onClick={() => handleCategorySelect(category.toLowerCase().replace(/\s+/g, '-'))}
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-500 dark:text-blue-300 font-bold">{category[0]}</span>
                </div>
              </div>
              <p className="text-sm font-medium">{category}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sponsored Products */}
      <div className="mt-10 mb-8">
        <SponsoredProducts gridLayout={gridLayout} />
      </div>
      
      {/* Product Recommendations */}
      <div className="mt-10">
        <RecommendedProducts gridLayout={gridLayout} />
      </div>
    </div>
  );
};

export default OptimizedMarketplace;
