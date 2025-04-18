
import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/loaders";
import { useLoading } from "@/providers/LoadingProvider";

// Lazy load non-critical components - Fixed imports to handle named exports
const BannerCarousel = lazy(() => 
  import("@/components/marketplace/BannerCarousel").then(module => ({ default: module.BannerCarousel }))
);
const CrazyDeals = lazy(() => 
  import("@/components/marketplace/CrazyDeals").then(module => ({ default: module.CrazyDeals }))
);
const SponsoredProducts = lazy(() => 
  import("@/components/marketplace/SponsoredProducts").then(module => ({ default: module.default }))
);
const TrendingProducts = lazy(() => 
  import("@/components/marketplace/TrendingProducts").then(module => ({ default: module.TrendingProducts }))
);
const PersonalizedRecommendations = lazy(() => 
  import("@/components/marketplace/PersonalizedRecommendations").then(module => ({ default: module.PersonalizedRecommendations }))
);
const ProductRankings = lazy(() => 
  import("@/components/rankings/ProductRankings").then(module => ({ default: module.ProductRankings }))
);
const BrowseTabContent = lazy(() => 
  import("./BrowseTabContent").then(module => ({ default: module.BrowseTabContent }))
);
const FlashSale = lazy(() => 
  import("@/components/marketplace/FlashSale").then(module => ({ default: module.FlashSale }))
);
const SponsoredRecommendations = lazy(() => 
  import("@/components/recommendations/SponsoredRecommendations").then(module => ({ default: module.SponsoredRecommendations }))
);

// Optimized section loader with reduced skeleton count
const LazySection = ({ children, fallbackCount = 2 }) => (
  <Suspense fallback={
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 animate-fade-in">
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
  const [isPageReady, setIsPageReady] = useState(false);
  
  const { setLoading } = useLoading();
  
  // Show loading indicator when page loads - significantly reduced loading time to 100ms
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      setIsPageReady(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, [setLoading]);
  
  // Preload critical images and resources for faster loading
  useEffect(() => {
    // Create link preload tags for critical resources
    const preloadImages = [
      '/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png',
      '/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png'
    ];
    
    const preloadLinks = preloadImages.map(image => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = image;
      return link;
    });
    
    // Add preload links to document head
    preloadLinks.forEach(link => document.head.appendChild(link));
    
    // Cleanup function to remove preload links
    return () => {
      preloadLinks.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);
  
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
    <div className="pt-2 sm:pt-4 px-2 sm:px-4 md:px-6 transition-opacity duration-200">
      {/* Search Bar - Full width on mobile, max-width on desktop */}
      <div className="mb-4 sm:mb-6 max-w-3xl mx-auto w-full">
        <AutocompleteSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={handleSearchSelect}
          placeholder="Search for products, services, or businesses..."
          className="w-full"
        />
      </div>
      
      {/* Main content sections with improved responsive spacing */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Banner - Lazy loaded with priority */}
        <LazySection fallbackCount={1}>
          <BannerCarousel />
        </LazySection>
        
        {/* Categories - Load immediately as it's critical */}
        <div className="mb-4 sm:mb-6">
          <ShopByCategory onCategorySelect={handleCategoryChange} />
        </div>
        
        {/* Lazy loaded sections with progressive enhancement */}
        <LazySection>
          <ProductRankings />
        </LazySection>
        
        <LazySection>
          <SponsoredRecommendations 
            title="Sponsored Products" 
            limit={4} 
          />
        </LazySection>
        
        <LazySection>
          <FlashSale />
        </LazySection>
        
        <LazySection>
          <CrazyDeals />
        </LazySection>
        
        {/* Main browse content */}
        <LazySection>
          <BrowseTabContent 
            searchTerm={searchQuery}
            onCategorySelect={handleCategoryChange}
          />
        </LazySection>
      </div>
    </div>
  );
};

export default OptimizedMarketplace;
