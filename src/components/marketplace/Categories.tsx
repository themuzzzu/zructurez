
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ShoppingCart,
  Home,
  Shirt,
  Gift,
  Phone,
  Utensils,
  Scissors,
  Car,
  BookOpen,
  Music,
  Gamepad2,
  Watch,
  Baby,
  Dumbbell
} from "lucide-react";

interface CategoryItem {
  name: string;
  icon: React.ReactNode;
}

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  trendingCategories?: string[];
  showAllCategories?: boolean;
}

export const Categories = ({
  onCategorySelect,
  trendingCategories = [],
  showAllCategories = false
}: CategoriesProps) => {
  const categories: CategoryItem[] = [
    { name: "All", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Electronics", icon: <Phone className="h-4 w-4" /> },
    { name: "Fashion", icon: <Shirt className="h-4 w-4" /> },
    { name: "Home", icon: <Home className="h-4 w-4" /> },
    { name: "Beauty", icon: <Scissors className="h-4 w-4" /> },
    { name: "Grocery", icon: <ShoppingCart className="h-4 w-4" /> },
    { name: "Food", icon: <Utensils className="h-4 w-4" /> },
    { name: "Automotive", icon: <Car className="h-4 w-4" /> },
    { name: "Books", icon: <BookOpen className="h-4 w-4" /> },
    { name: "Music", icon: <Music className="h-4 w-4" /> },
    { name: "Gaming", icon: <Gamepad2 className="h-4 w-4" /> },
    { name: "Watches", icon: <Watch className="h-4 w-4" /> },
    { name: "Baby", icon: <Baby className="h-4 w-4" /> },
    { name: "Sports", icon: <Dumbbell className="h-4 w-4" /> },
    { name: "Gifts", icon: <Gift className="h-4 w-4" /> },
  ];

  // Filter to just trending categories if provided and not showing all
  const displayCategories = showAllCategories 
    ? categories 
    : trendingCategories?.length 
      ? categories.filter(cat => 
          cat.name === "All" || 
          trendingCategories.some(trend => 
            trend.toLowerCase() === cat.name.toLowerCase()
          )
        )
      : categories.slice(0, 7); // Show first 7 if no trending categories

  return (
    <ScrollArea className="w-full pb-2">
      <div className="flex space-x-2 pb-1">
        {displayCategories.map((category) => (
          <Button
            key={category.name}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 whitespace-nowrap"
            onClick={() => onCategorySelect(category.name === "All" ? "" : category.name.toLowerCase())}
          >
            {category.icon}
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
