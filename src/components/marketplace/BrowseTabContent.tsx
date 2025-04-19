
import React from "react";
import { useNavigate } from "react-router-dom";
import { CategoryIconGrid } from "./CategoryIconGrid";
import { Button } from "@/components/ui/button";

interface BrowseTabContentProps {
  searchResults?: any[];
  searchTerm?: string;
  isSearching?: boolean;
  onCategorySelect?: (category: string) => void;
  onSearchSelect?: (term: string) => void;
}

export const BrowseTabContent: React.FC<BrowseTabContentProps> = ({
  searchResults = [],
  searchTerm = "",
  isSearching = false,
  onCategorySelect,
  onSearchSelect
}) => {
  const navigate = useNavigate();
  
  const handleCategorySelect = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    navigate(`/marketplace/category/${category}`);
  };

  return (
    <div className="space-y-6">
      {/* Category Icons Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
        <CategoryIconGrid onCategorySelect={handleCategorySelect} />
      </div>
      
      {/* Placeholder for other content */}
      <div className="bg-muted/30 p-6 rounded-lg text-center">
        <h3 className="text-lg font-medium mb-2">Browse Marketplace</h3>
        <p className="text-muted-foreground mb-4">
          Select a category above to start browsing products
        </p>
        <Button onClick={() => navigate("/marketplace")}>
          View All Products
        </Button>
      </div>
    </div>
  );
};
