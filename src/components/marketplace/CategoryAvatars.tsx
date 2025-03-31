
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Smartphone, Laptop, Headphones, Watch, Camera, 
  Shirt, Bookmark, Gift, Home, Coffee, Car, Baby
} from "lucide-react";

interface CategoryAvatarsProps {
  onCategorySelect: (category: string) => void;
}

export const CategoryAvatars = ({ onCategorySelect }: CategoryAvatarsProps) => {
  const navigate = useNavigate();
  const [categories] = useState([
    { name: "Electronics", icon: <Smartphone size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Computers", icon: <Laptop size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Audio", icon: <Headphones size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Wearables", icon: <Watch size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Cameras", icon: <Camera size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Fashion", icon: <Shirt size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Books", icon: <Bookmark size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Gifts", icon: <Gift size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Home", icon: <Home size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Kitchen", icon: <Coffee size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Automotive", icon: <Car size={24} className="stroke-black dark:stroke-white" /> },
    { name: "Baby", icon: <Baby size={24} className="stroke-black dark:stroke-white" /> }
  ]);
  
  const handleCategoryClick = (category: string) => {
    onCategorySelect(category.toLowerCase());
    navigate(`/marketplace?category=${category.toLowerCase()}`);
  };
  
  return (
    <Card className="bg-white dark:bg-zinc-800 p-4 border border-gray-200 dark:border-zinc-700 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.name.toLowerCase())}
            className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              {category.icon}
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};
