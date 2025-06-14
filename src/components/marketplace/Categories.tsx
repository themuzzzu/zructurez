
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  showAllCategories?: boolean;
}

export const Categories: React.FC<CategoriesProps> = ({ 
  onCategorySelect, 
  showAllCategories = false 
}) => {
  const categories = [
    { id: "all", name: "All Categories", count: 1250 },
    { id: "electronics", name: "Electronics", count: 245 },
    { id: "fashion", name: "Fashion", count: 189 },
    { id: "home", name: "Home & Garden", count: 167 },
    { id: "sports", name: "Sports", count: 134 },
    { id: "books", name: "Books", count: 98 },
    { id: "toys", name: "Toys", count: 87 },
    { id: "automotive", name: "Automotive", count: 76 },
    { id: "health", name: "Health & Beauty", count: 65 },
    { id: "food", name: "Food & Beverages", count: 54 },
  ];

  const displayCategories = showAllCategories ? categories : categories.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {displayCategories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => onCategorySelect(category.id)}
          >
            <span className="font-medium text-sm mb-1">{category.name}</span>
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};
