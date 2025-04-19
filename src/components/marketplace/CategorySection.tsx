
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CategorySectionProps {
  onCategorySelect: (category: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  
  const categories = [
    { id: "electronics", name: "Electronics", icon: "/lovable-uploads/d01039d6-6bee-4097-9c23-8981fd856e92.png" },
    { id: "fashion", name: "Fashion", icon: "/lovable-uploads/db350618-6a6d-4b77-9761-78b2c5a9d56e.png" },
    { id: "grocery", name: "Grocery", icon: "/lovable-uploads/5942c156-f468-4ea2-a34f-796b645655ca.png" },
    { id: "home", name: "Home", icon: "/lovable-uploads/46a5e835-fcad-4044-8ca3-a3b617d56afd.png" },
    { id: "beauty", name: "Beauty", icon: "/lovable-uploads/bbbc13ee-6ebf-4bb8-b472-95ef720eed0c.png" },
    { id: "sports", name: "Sports", icon: "/lovable-uploads/0c11e8d4-b796-449e-a507-165623e30fc7.png" },
  ];

  const handleSeeAll = () => {
    navigate("/marketplace/categories");
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Shop by Category</h2>
        <Button variant="link" className="text-blue-500" onClick={handleSeeAll}>
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="p-2 sm:p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-2">
              <img
                src={category.icon}
                alt={category.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
