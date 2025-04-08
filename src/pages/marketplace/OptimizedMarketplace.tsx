
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
import { ProductRankings } from "@/components/rankings/ProductRankings";
import { BrowseTabContent } from "@/components/marketplace/BrowseTabContent";
import { SkeletonCard } from "@/components/loaders";
import { useLoading } from "@/providers/LoadingProvider";
import { FlashSale } from "@/components/marketplace/FlashSale";

// Optimized LazySection for better performance
const LazySection = ({ children, fallbackCount = 4 }) => (
  <Suspense fallback={
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
      {Array.from({ length: Math.min(fallbackCount, 2) }).map((_, i) => (
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
  
  // Show loading indicator when page loads - significantly reduced loading time
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 200);
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
    <div className="container max-w-[1400px] mx-auto px-2 sm:px-4 pt-0 pb-4 sm:py-6 overflow-visible">
      {/* Single Search Bar at the top with improved design */}
      <div className="mb-3 sm:mb-4">
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
        <div className="mb-3 sm:mb-4">
          <BannerCarousel />
        </div>
      </LazySection>
      
      {/* New Shop by Category section */}
      <div className="mb-3 sm:mb-4">
        <ShopByCategory onCategorySelect={handleCategoryChange} />
      </div>
      
      {/* Real-time Product Rankings */}
      <LazySection>
        <div className="mb-3 sm:mb-6">
          <ProductRankings />
        </div>
      </LazySection>
      
      {/* Flash Sale Section */}
      <LazySection>
        <div className="mb-3 sm:mb-6">
          <FlashSale />
        </div>
      </LazySection>
      
      {/* Sponsored Products Section */}
      <LazySection>
        <div className="mb-3 sm:mb-6">
          <SponsoredProducts gridLayout={gridLayout} />
        </div>
      </LazySection>
      
      {/* Trending Products */}
      <LazySection>
        <div className="mb-3 sm:mb-6">
          <TrendingProducts gridLayout={gridLayout} />
        </div>
      </LazySection>
      
      {/* Personalized Recommendations */}
      <LazySection>
        <div className="mb-3 sm:mb-6">
          <PersonalizedRecommendations />
        </div>
      </LazySection>
      
      {/* Crazy Deals Section */}
      <LazySection>
        <div className="mb-3 sm:mb-6">
          <CrazyDeals />
        </div>
      </LazySection>
      
      {/* Main content - Browse All */}
      <LazySection>
        <div className="mt-3 sm:mt-6">
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
