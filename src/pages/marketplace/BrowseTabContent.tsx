
import { useState, useEffect } from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Categories } from "@/components/marketplace/Categories";
import { useNavigate, useLocation } from "react-router-dom";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";
import { CategoryIconGrid } from "@/components/marketplace/CategoryIconGrid";
import { CategorySubcategoryGrid } from "@/components/marketplace/CategorySubcategoryGrid";
import { MarketplaceBanner } from "@/components/marketplace/MarketplaceBanner";

interface BrowseTabContentProps {
  searchResults?: any[];
  searchTerm?: string;
  isSearching?: boolean;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
}

export const BrowseTabContent = ({
  searchResults = [],
  searchTerm = "",
  isSearching = false,
  onCategorySelect,
  onSearchSelect
}: BrowseTabContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  
  // Parse URL query parameters to set initial category and subcategory
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const subcategoryParam = params.get('subcategory');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }
  }, [location.search]);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    
    if (category !== "all") {
      navigate(`/marketplace?category=${category}`);
    } else {
      navigate('/marketplace');
    }
    
    // Call the parent handler if provided
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };
  
  const handleSubcategorySelect = (category: string, subcategory?: string) => {
    setSelectedCategory(category);
    
    if (subcategory) {
      setSelectedSubcategory(subcategory);
      navigate(`/marketplace?category=${category}&subcategory=${subcategory}`);
    } else {
      setSelectedSubcategory("");
      navigate(`/marketplace?category=${category}`);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Banner */}
      <MarketplaceBanner />
      
      {/* Category Icons - Moved right below banner */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
        <CategoryIconGrid onCategorySelect={handleCategorySelect} />
      </div>
      
      {/* Categories Navigation */}
      <div className="mb-6 px-2">
        <Categories 
          onCategorySelect={handleCategorySelect} 
          showAllCategories={true}
        />
      </div>
      
      {/* If a category is selected, display subcategories */}
      {selectedCategory !== "all" && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2">Browse {selectedCategory}</h2>
          <CategorySubcategoryGrid onCategorySelect={handleSubcategorySelect} />
        </div>
      )}
      
      {/* Sponsored Products */}
      <SponsoredProducts />
      
      {/* Trending Products */}
      <TrendingProducts />
      
      {/* Product Sections */}
      <div className="space-y-12">
        {/* Shopping Section - filtered by category */}
        <ShoppingSection 
          searchQuery={searchTerm || ""}
          selectedCategory={selectedCategory === "all" ? "" : selectedCategory}
        />
      </div>
    </div>
  );
};
