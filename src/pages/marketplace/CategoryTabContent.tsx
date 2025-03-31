
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Shirt, 
  Home, 
  Utensils, 
  Smartphone, 
  Laptop, 
  HeartPulse, 
  Baby, 
  Car, 
  BookOpen,
  Gamepad2,
  ShoppingBag,
  Paintbrush
} from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface CategoryTabContentProps {
  setSelectedCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;
  gridLayout?: GridLayoutType;
}

export const CategoryTabContent = ({ 
  setSelectedCategory, 
  setActiveTab,
  gridLayout = "grid4x4"
}: CategoryTabContentProps) => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Fashion", icon: <Shirt className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Home", icon: <Home className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Kitchen", icon: <Utensils className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Phones", icon: <Smartphone className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Electronics", icon: <Laptop className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Health", icon: <HeartPulse className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Baby", icon: <Baby className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Automotive", icon: <Car className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Books", icon: <BookOpen className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Gaming", icon: <Gamepad2 className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Beauty", icon: <Paintbrush className="h-5 w-5 stroke-black dark:stroke-white" /> },
    { name: "Groceries", icon: <ShoppingBag className="h-5 w-5 stroke-black dark:stroke-white" /> },
  ];
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category.toLowerCase());
    setActiveTab("search");
    navigate(`/marketplace?category=${category.toLowerCase()}`);
  };
  
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4";
      case "grid1x1":
        return "flex flex-col gap-4";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4";
    }
  };
  
  return (
    <div className={getGridClasses()}>
      {categories.map((category) => (
        <Card
          key={category.name}
          className={`transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer ${
            gridLayout === "grid1x1" ? "flex items-center p-4" : "p-6 text-center"
          }`}
          onClick={() => handleCategoryClick(category.name)}
        >
          {gridLayout === "grid1x1" ? (
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                {category.icon}
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </div>
          ) : (
            <>
              <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {category.icon}
              </div>
              <h3 className="font-medium">{category.name}</h3>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};
