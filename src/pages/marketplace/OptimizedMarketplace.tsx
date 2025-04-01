
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowseTabContent } from "./BrowseTabContent";
import { SearchTabContent } from "./SearchTabContent";
import { GridLayoutType } from "@/components/products/types/layouts";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";

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
  
  // State for filters and layout
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
  
  // Handle search selection from autocomplete
  const handleSearchSelect = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
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
    <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Single Search Bar at the top with improved design */}
      <div className="mb-6">
        <AutocompleteSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={handleSearchSelect}
          placeholder="Search for products, services, or businesses..."
          className="w-full max-w-3xl mx-auto"
        />
      </div>
      
      {/* Banner carousel below search */}
      <div className="mb-6 px-1 sm:px-2">
        <BannerCarousel />
      </div>
      
      {/* Main content - Browse All by default */}
      <div className="mt-4">
        <BrowseTabContent 
          searchTerm={searchQuery}
          onCategorySelect={handleCategoryChange}
        />
      </div>
    </div>
  );
};

export default OptimizedMarketplace;
