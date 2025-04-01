
import { useState } from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Categories } from "@/components/marketplace/Categories";
import { useNavigate } from "react-router-dom";
import { SponsoredProducts } from "@/components/marketplace/SponsoredProducts";
import { TrendingProducts } from "@/components/marketplace/TrendingProducts";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    if (category !== "all") {
      navigate(`/marketplace?category=${category}`);
    }
    
    // Call the parent handler if provided
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="mb-6 px-2">
        <Categories 
          onCategorySelect={handleCategorySelect} 
          showAllCategories={true}
        />
      </div>
      
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
