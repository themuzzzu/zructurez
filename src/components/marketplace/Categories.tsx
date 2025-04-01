
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shirt, Home, ShoppingBag, Utensils, Gift, Car, Camera, Heart, Paintbrush, Leaf } from "lucide-react";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  trendingCategories?: string[];
  showAllCategories?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  clothing: <Shirt className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  electronics: <ShoppingBag className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  gifts: <Gift className="h-4 w-4" />,
  automotive: <Car className="h-4 w-4" />,
  photography: <Camera className="h-4 w-4" />,
  health: <Heart className="h-4 w-4" />,
  art: <Paintbrush className="h-4 w-4" />,
  beauty: <Leaf className="h-4 w-4" />,
};

const categoryNames: Record<string, string> = {
  all: "All Categories",
  clothing: "Clothing & Fashion",
  electronics: "Electronics",
  home: "Home & Garden",
  beauty: "Beauty & Personal Care",
  sports: "Sports & Outdoors",
  toys: "Toys & Games",
  books: "Books & Media",
  health: "Health & Wellness",
  jewelry: "Jewelry & Accessories",
  automotive: "Automotive",
  pet: "Pet Supplies",
  grocery: "Grocery & Food",
  furniture: "Furniture",
  art: "Art & Collectibles",
};

export const Categories = ({ 
  onCategorySelect, 
  trendingCategories = [],
  showAllCategories = false 
}: CategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };
  
  // If trending categories are empty, use the predefined list
  const categories = trendingCategories.length > 0 
    ? ["all", ...trendingCategories] 
    : ["all", "clothing", "electronics", "home", "beauty", "sports", "toys", "books", "health"];
  
  // For showing all categories
  const allCategories = showAllCategories 
    ? Object.keys(categoryNames) 
    : categories;

  return (
    <div className="py-2">
      <h2 className="text-lg font-semibold mb-3 px-1">Browse by Category</h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-4">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className={cn(
                "h-9 px-4 py-2 cursor-pointer whitespace-nowrap border border-gray-200 dark:border-gray-700",
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background hover:bg-accent/50 transition-colors"
              )}
              onClick={() => handleCategoryClick(category)}
            >
              {categoryIcons[category] && (
                <span className="mr-2">{categoryIcons[category]}</span>
              )}
              {categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
