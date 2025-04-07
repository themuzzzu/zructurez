
import { useState, useEffect } from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Categories } from "@/components/marketplace/Categories";
import { useNavigate, useLocation } from "react-router-dom";
import { CategorySubcategoryGrid } from "@/components/marketplace/CategorySubcategoryGrid";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GridLayoutSelector } from "@/components/marketplace/GridLayoutSelector";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface BrowseTabContentProps {
  searchResults?: any[];
  searchTerm?: string;
  isSearching?: boolean;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
  gridLayout?: GridLayoutType;
  onLayoutChange?: (layout: GridLayoutType) => void;
}

export const BrowseTabContent = ({
  searchResults = [],
  searchTerm = "",
  isSearching = false,
  onCategorySelect,
  onSearchSelect,
  gridLayout = "grid4x4",
  onLayoutChange
}: BrowseTabContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [localGridLayout, setLocalGridLayout] = useState<GridLayoutType>(gridLayout);
  
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
  
  // Update local grid layout when prop changes
  useEffect(() => {
    setLocalGridLayout(gridLayout);
  }, [gridLayout]);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    
    if (category !== "all") {
      navigate(`/products?category=${category}`);
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
      navigate(`/products?category=${category}&subcategory=${subcategory}`);
    } else {
      setSelectedSubcategory("");
      navigate(`/products?category=${category}`);
    }
  };
  
  const handleLayoutChange = (layout: GridLayoutType) => {
    setLocalGridLayout(layout);
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Categories Navigation */}
      <ErrorBoundary>
        <div className="mb-6 px-2">
          <Categories 
            onCategorySelect={handleCategorySelect} 
            showAllCategories={true}
          />
        </div>
      </ErrorBoundary>
      
      {/* If a category is selected, display subcategories */}
      {selectedCategory !== "all" && (
        <ErrorBoundary>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 px-2">Browse {selectedCategory.replace(/-/g, ' ')}</h2>
            <CategorySubcategoryGrid onCategorySelect={handleSubcategorySelect} />
          </div>
        </ErrorBoundary>
      )}
      
      {/* Product Sections */}
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header with Grid Layout Selector */}
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="text-xl font-bold">Products</h2>
            <GridLayoutSelector layout={localGridLayout} onChange={handleLayoutChange} />
          </div>
          
          {/* Shopping Section - filtered by category */}
          <ShoppingSection 
            searchQuery={searchTerm || ""}
            selectedCategory={selectedCategory === "all" ? "" : selectedCategory}
            gridLayout={localGridLayout}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default BrowseTabContent;
