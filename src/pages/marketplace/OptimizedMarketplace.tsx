
import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { BannerCarousel } from "@/components/marketplace/BannerCarousel";
import { CrazyDeals } from "@/components/marketplace/CrazyDeals";
import SponsoredProducts from "@/components/marketplace/SponsoredProducts";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts"; 
import { PersonalizedRecommendations } from "@/components/marketplace/PersonalizedRecommendations";
import { ProductRankings } from "@/components/rankings/ProductRankings";
import { BrowseTabContent } from "@/components/marketplace/BrowseTabContent";
import { SkeletonCard } from "@/components/loaders";
import { useLoading } from "@/providers/LoadingProvider";
import { FlashSale } from "@/components/marketplace/FlashSale";
import { SponsoredRecommendations } from "@/components/recommendations/SponsoredRecommendations";

// Optimized LazySection for better performance - reduced loading skeleton count
const LazySection = ({ children, fallbackCount = 2 }) => (
  <Suspense fallback={
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
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
  
  // Show loading indicator when page loads - significantly reduced loading time to 100ms
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 100);
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
    <div className="pt-2 sm:pt-0 px-1 sm:px-2">
      {/* Single Search Bar at the top with improved design - fixed padding */}
      <div className="mb-4 sm:mb-6">
        <AutocompleteSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={handleSearchSelect}
          placeholder="Search for products, services, or businesses..."
          className="w-full max-w-3xl mx-auto"
        />
      </div>
      
      {/* Banner carousel below search - fixed styling for better scrolling */}
      <LazySection fallbackCount={1}>
        <div className="mb-4 sm:mb-6">
          <BannerCarousel />
        </div>
      </LazySection>
      
      {/* New Shop by Category section - improved spacing */}
      <div className="mb-4 sm:mb-6">
        <ShopByCategory onCategorySelect={handleCategoryChange} />
      </div>
      
      {/* Real-time Product Rankings - improved spacing */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <ProductRankings />
        </div>
      </LazySection>

      {/* Sponsored Products below rankings - NEW */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <SponsoredRecommendations 
            title="Sponsored Products" 
            limit={4} 
          />
        </div>
      </LazySection>
      
      {/* Flash Sale Section - improved spacing */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <FlashSale />
        </div>
      </LazySection>
      
      {/* Sponsored Products Section - improved spacing */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <SponsoredProducts gridLayout={gridLayout} />
        </div>
      </LazySection>
      
      {/* Trending Products - improved spacing */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <TrendingProducts gridLayout={gridLayout} />
        </div>
      </LazySection>
      
      {/* Personalized Recommendations - improved spacing */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <PersonalizedRecommendations />
        </div>
      </LazySection>
      
      {/* Crazy Deals Section - improved spacing */}
      <LazySection>
        <div className="mb-4 sm:mb-6">
          <CrazyDeals />
        </div>
      </LazySection>
      
      {/* Main content - Browse All */}
      <LazySection>
        <div className="mt-4 sm:mt-6">
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
