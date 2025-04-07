
import { useState, useEffect, lazy, Suspense } from "react";
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
import { BrowseTabContent } from "@/pages/marketplace/BrowseTabContent";
import { LoadingView } from "@/components/LoadingView";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";

// Create a fallback skeleton component
const SkeletonCard = () => (
  <div className="rounded-md overflow-hidden border">
    <div className="h-48 bg-muted animate-pulse"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
      <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
    </div>
  </div>
);

const LazySection = ({ children, fallbackCount = 4, className = "" }: { children: React.ReactNode, fallbackCount?: number, className?: string }) => (
  <ErrorBoundary fallback={<div className="p-4 text-red-500">Failed to load section. Please refresh.</div>}>
    <Suspense fallback={
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: fallbackCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    }>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const OptimizedMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const subcategoryParam = searchParams.get("subcategory") || "";
  const { toast } = useToast();
  
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
  const [gridLayout, setGridLayout] = useState<GridLayoutType>(() => {
    try {
      // Try to get user's saved preference from localStorage
      const savedLayout = localStorage.getItem("preferredGridLayout");
      return (savedLayout as GridLayoutType) || "grid4x4";
    } catch (error) {
      console.error("Error loading grid layout from localStorage:", error);
      return "grid4x4";
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Show loading indicator when page loads
  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timeout);
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
  
  useEffect(() => {
    console.log("OptimizedMarketplace rendered with layout:", gridLayout);
    
    return () => {
      console.log("OptimizedMarketplace unmounted");
    };
  }, [gridLayout]);

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
    try {
      setSearchQuery(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Search navigation error:", error);
      toast({
        title: "Search Error",
        description: "There was a problem processing your search.",
        variant: "destructive"
      });
    }
  };
  
  // Update URL when category changes
  const handleCategoryChange = (category: string, subcategory?: string) => {
    try {
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
    } catch (error) {
      console.error("Category navigation error:", error);
    }
  };

  // Handle grid layout change
  const handleLayoutChange = (layout: GridLayoutType) => {
    try {
      console.log("Changing grid layout to:", layout);
      setGridLayout(layout);
      localStorage.setItem("preferredGridLayout", layout);
    } catch (error) {
      console.error("Error saving grid layout:", error);
    }
  };
  
  if (isLoading) {
    return <LoadingView />;
  }
  
  return (
    <div className="container max-w-[1400px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
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
      <ErrorBoundary>
        <div className="mb-4 sm:mb-6">
          <BannerCarousel />
        </div>
      </ErrorBoundary>
      
      {/* New Shop by Category section */}
      <ErrorBoundary>
        <div className="mb-4 sm:mb-6">
          <ShopByCategory onCategorySelect={handleCategoryChange} />
        </div>
      </ErrorBoundary>
      
      {/* Real-time Product Rankings */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <ProductRankings />
        </div>
      </LazySection>
      
      {/* Sponsored Products Section - Emphasized as per request */}
      <LazySection>
        <div className="mb-4 sm:mb-8">
          <h2 className="text-2xl font-bold mb-4">Sponsored Products</h2>
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
            gridLayout={gridLayout}
            onLayoutChange={handleLayoutChange}
          />
        </div>
      </LazySection>
    </div>
  );
};

export default OptimizedMarketplace;
