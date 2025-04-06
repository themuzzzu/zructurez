
import { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { CrazyDeals } from "@/components/marketplace/CrazyDeals";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts"; 
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { TopProducts } from "@/components/recommendations/TopProducts";
import { ProductRankings } from "@/components/rankings/ProductRankings";
import { BrowseTabContent } from "@/components/marketplace/BrowseTabContent";
import { SkeletonCard } from "@/components/loaders/SkeletonCard";
import { useLoading } from "@/providers/LoadingProvider";
import { FlashSale } from "@/components/marketplace/FlashSale";

const LazySection = ({ children, fallbackCount = 4 }) => (
  <Suspense fallback={
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: fallbackCount }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  }>
    {children}
  </Suspense>
);

export const OptimizedMarketplace = () => {
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
  
  const { setLoading } = useLoading();
  
  // Show loading indicator when page loads
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, [setLoading]);
  
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
    <div className="container max-w-[1400px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Remove progress loader */}
      
      {/* Single Search Bar at the top with improved design */}
      <div className="mb-4 sm:mb-6">
        <AutocompleteSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={handleSearchSelect}
          placeholder="Search for products, services, or businesses..."
          className="w-full max-w-3xl mx-auto"
        />
      </div>
      
      {/* Banner carousel below search */}
      <LazySection fallbackCount={1}>
        <div className="mb-4 sm:mb-6">
          <BannerCarousel />
        </div>
      </LazySection>
      
      {/* New Shop by Category section */}
      <div className="mb-4 sm:mb-6">
        <ShopByCategory onCategorySelect={handleCategoryChange} />
      </div>
      
      {/* Flash Sale Section */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <FlashSale />
        </div>
      </LazySection>
      
      {/* Real-time Product Rankings */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <ProductRankings />
        </div>
      </LazySection>
      
      {/* Sponsored Products Section */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <SponsoredProducts gridLayout={gridLayout} />
        </div>
      </LazySection>
      
      {/* Trending Products */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <TrendingProducts gridLayout={gridLayout} />
        </div>
      </LazySection>
      
      {/* Personalized Recommendations */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <PersonalizedRecommendations />
        </div>
      </LazySection>
      
      {/* Crazy Deals Section */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <CrazyDeals />
        </div>
      </LazySection>
      
      {/* Main content - Browse All */}
      <LazySection>
        <div className="mt-4 sm:mt-8">
          <BrowseTabContent 
            searchTerm={searchQuery}
            onCategorySelect={handleCategoryChange}
          />
        </div>
      </LazySection>
    </div>
  );
};

export default OptimizedMarketplace;
