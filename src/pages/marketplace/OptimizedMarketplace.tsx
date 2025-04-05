
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/layouts";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { CrazyDeals } from "@/components/marketplace/CrazyDeals";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts"; 
import { RecommendedProducts } from "@/components/marketplace/RecommendedProducts";
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { TopProducts } from "@/components/recommendations/TopProducts";
import { ProductRankings } from "@/components/rankings/ProductRankings";

// Import from correct location - make sure components exist at these paths
import { BrowseTabContent } from "@/pages/marketplace/BrowseTabContent";
import { SearchTabContent } from "@/pages/marketplace/SearchTabContent";

const OptimizedMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const subcategoryParam = searchParams.get("subcategory") || "";
  
  // State for search and cart
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // State for filters and layout
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [showBranded, setShowBranded] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid4x4");
  
  // Update state when URL parameters change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
    
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [categoryParam, subcategoryParam, queryParam]);
  
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("");
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
  const handleCategoryChange = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    if (subcategory) {
      setSelectedSubcategory(subcategory);
    } else {
      setSelectedSubcategory("");
    }
    
    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set("q", searchQuery);
    }
    
    if (category !== "all") {
      newSearchParams.set("category", category);
      
      if (subcategory) {
        newSearchParams.set("subcategory", subcategory);
      }
    }
    
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString()
    });
  };
  
  return (
    <div className="container max-w-[1400px] mx-auto px-3 sm:px-4 py-6">
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
      <div className="mb-6">
        <BannerCarousel />
      </div>
      
      {/* New Shop by Category section */}
      <div className="mb-6">
        <ShopByCategory onCategorySelect={handleCategoryChange} />
      </div>
      
      {/* Sponsored Products Section */}
      <div className="mb-8">
        <SponsoredProducts />
      </div>
      
      {/* Trending Products */}
      <div className="mb-8">
        <TrendingProducts />
      </div>
      
      {/* Product Rankings - Added new section */}
      <div className="mb-8">
        <ProductRankings />
      </div>
      
      {/* Top Products - renamed from SponsoredRecommendations */}
      <div className="mb-8">
        <TopProducts title="Top Products" showTitle={true} />
      </div>
      
      {/* Personalized Recommendations */}
      <div className="mb-8">
        <PersonalizedRecommendations />
      </div>
      
      {/* Recommended Products */}
      <div className="mb-8">
        <RecommendedProducts />
      </div>
      
      {/* Crazy Deals Section */}
      <div className="mb-8">
        <CrazyDeals />
      </div>
      
      {/* Main content - Browse All */}
      <div className="mt-8">
        <BrowseTabContent 
          searchTerm={searchQuery}
          onCategorySelect={handleCategoryChange}
        />
      </div>
    </div>
  );
};

export default OptimizedMarketplace;
