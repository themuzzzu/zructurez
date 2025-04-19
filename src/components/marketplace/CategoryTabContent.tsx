
import React from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Categories } from "./Categories";

interface CategoryTabContentProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryTabContent: React.FC<CategoryTabContentProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Categories onCategorySelect={handleCategorySelect} />
      </div>
      
      <ShoppingSection
        searchQuery=""
        selectedCategory={selectedCategory === "all" ? "" : selectedCategory}
      />
    </div>
  );
};
