import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  "All",
  "General",
  "Events",
  "For Sale",
  "Safety",
  "Lost & Found",
  "Recommendations",
  "Crime & Safety",
  "Local News",
  "Free Items",
  "Pets",
];

export const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    toast.success(`Filtered by ${category}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide animate-fade-up [animation-delay:100ms]">
      {categories.map((category, index) => (
        <Button
          key={category}
          variant={category === selectedCategory ? "default" : "outline"}
          className={`whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md ${
            category === selectedCategory 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-card hover:bg-accent"
          }`}
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