
import { useState } from "react";
import { ShoppingSection } from "@/components/ShoppingSection";
import { Categories } from "@/components/marketplace/Categories";
import { useNavigate } from "react-router-dom";

export const BrowseTabContent = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    if (category !== "all") {
      navigate(`/marketplace?category=${category}`);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Categories moved to Browse All tab */}
      <div className="mb-6">
        <Categories 
          onCategorySelect={handleCategorySelect} 
          showAllCategories={true}
        />
      </div>
      
      <ShoppingSection 
        searchQuery=""
        selectedCategory={selectedCategory === "all" ? "" : selectedCategory}
      />
    </div>
  );
};
