
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { BrowseTabContent } from "./BrowseTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { CategoryTabContent } from "./CategoryTabContent";
import { GridLayoutType } from "@/components/products/types/layouts";

const OptimizedMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  
  // State for search and cart
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("browse");
  
  // State for filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  
  const resetFilters = () => {
    setSelectedCategory("all");
    setShowDiscounted(false);
    setShowUsed(false);
    setShowBranded(false);
    setSortOption("newest");
    setPriceRange("all");
  };
  
  // Update URL when search query changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setActiveTab("search");
    
    const newSearchParams = new URLSearchParams();
    if (query) {
      newSearchParams.set("q", query);
    }
    if (selectedCategory !== "all") {
      newSearchParams.set("category", selectedCategory);
    }
    
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };
  
  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveTab(category === "all" ? "browse" : "category");
    
    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set("q", searchQuery);
    }
    if (category !== "all") {
      newSearchParams.set("category", category);
    }
    
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };
  
  return (
    <div className="container max-w-[1400px] mx-auto px-4 py-6">
      <MarketplaceHeader
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        onSearch={handleSearchChange}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="search" disabled={!searchQuery}>Search Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <BrowseTabContent />
        </TabsContent>
        
        <TabsContent value="category" className="mt-6">
          <CategoryTabContent 
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="search" className="mt-6">
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
