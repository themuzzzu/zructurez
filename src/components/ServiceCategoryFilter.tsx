import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  "All",
  "Plumbing",
  "Electrical",
  "Computer Repair",
  "Landscaping",
  "Cleaning",
  "HVAC",
  "Carpentry",
  "Painting",
  "Moving",
  "Pest Control",
];

export const ServiceCategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    toast.success(`Filtered by ${category}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide animate-fade-up">
      {categories.map((category, index) => (
        <Button
          key={category}
          variant={category === selectedCategory ? "default" : "outline"}
          className="whitespace-nowrap transition-all duration-300 hover:scale-105"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};