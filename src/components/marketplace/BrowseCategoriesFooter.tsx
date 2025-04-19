
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const BrowseCategoriesFooter = () => {
  const navigate = useNavigate();
  
  const allCategories = [
    "Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Toys",
    "Books", "Garden", "Automotive", "Grocery", "Health", "Pet Supplies",
    "Baby", "Jewelry", "Office Products", "Tools", "Music", "Movies"
  ];
  
  // Only show the first 10 categories with an option to see all
  const displayedCategories = allCategories.slice(0, 10);
  
  const handleCategoryClick = (category: string) => {
    navigate(`/marketplace/category/${category.toLowerCase().replace(/\s+/g, '-')}`);
  };
  
  const handleViewAllCategories = () => {
    navigate('/marketplace/categories');
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Browse by Category</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {displayedCategories.map(category => (
          <Button
            key={category}
            variant="outline"
            className="justify-start px-3 py-2 h-auto text-left"
            onClick={() => handleCategoryClick(category)}
          >
            <span>{category}</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        ))}
        <Button
          variant="outline"
          className="justify-start px-3 py-2 h-auto text-left text-blue-500 border-dashed"
          onClick={handleViewAllCategories}
        >
          <span>View All Categories</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
