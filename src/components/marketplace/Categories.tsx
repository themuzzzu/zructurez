
import React from "react";
import { Button } from "@/components/ui/button";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  showAllCategories?: boolean;
}

export const Categories: React.FC<CategoriesProps> = ({ 
  onCategorySelect,
  showAllCategories = true
}) => {
  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Garden",
    "Automotive",
    "Grocery"
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {showAllCategories && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onCategorySelect("all")}
          className="rounded-full"
        >
          All Categories
        </Button>
      )}
      
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => onCategorySelect(category.toLowerCase())}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
