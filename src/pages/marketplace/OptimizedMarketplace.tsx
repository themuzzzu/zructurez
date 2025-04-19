
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { AutocompleteSearch } from "@/components/marketplace/AutocompleteSearch";
import { useLoading } from "@/providers/LoadingProvider";
import { MarketplaceSections } from "@/components/marketplace/MarketplaceSections";

export const OptimizedMarketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const subcategoryParam = searchParams.get("subcategory") || "";
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryParam);
  const [isPageReady, setIsPageReady] = useState(false);
  const [gridLayout] = useState<GridLayoutType>("grid4x4");
  
  const { setLoading } = useLoading();
  
  // Show loading indicator when page loads
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
    
    preloadLinks.forEach(link => document.head.appendChild(link));
    
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
      {/* Search Bar - Always at the top */}
      <div className="mb-4 sm:mb-6 max-w-3xl mx-auto w-full">
        <AutocompleteSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearchSelect={handleSearchSelect}
          placeholder="Search for products, services, or businesses..."
          className="w-full"
        />
      </div>
      
      {/* Main content with organized sections */}
      <MarketplaceSections 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onCategoryChange={handleCategoryChange}
        gridLayout={gridLayout}
      />
    </div>
  );
};

export default OptimizedMarketplace;
