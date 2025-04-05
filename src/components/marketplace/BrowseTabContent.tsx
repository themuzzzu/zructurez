
import { useState } from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { useNavigate } from "react-router-dom";
import { ShopByCategory } from "@/components/marketplace/ShopByCategory";

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
      navigate(`/products?category=${category}`);
    } else {
      navigate('/marketplace');
    }
    
    // Call the parent handler if provided
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Shop By Category Section with horizontal scrollable categories */}
      <div className="mb-4">
        <ShopByCategory onCategorySelect={handleCategorySelect} />
      </div>

      {/* Main Shopping Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 px-1">All Products</h2>
        <ShoppingSection 
          searchQuery={searchTerm || ""}
          selectedCategory={selectedCategory === "all" ? "" : selectedCategory}
        />
      </div>
    </div>
  );
};
