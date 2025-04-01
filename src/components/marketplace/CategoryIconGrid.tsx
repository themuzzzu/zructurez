
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Smartphone, 
  ShoppingBag, 
  Home, 
  Clock, 
  Tv, 
  Users, 
  Utensils,
  BookOpen
} from "lucide-react";

interface CategoryIconGridProps {
  onCategorySelect?: (category: string) => void;
}

export const CategoryIconGrid = ({ onCategorySelect }: CategoryIconGridProps) => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Electronics", icon: Smartphone },
    { name: "Fashion", icon: ShoppingBag },
    { name: "Home Decor", icon: Home },
    { name: "Watches", icon: Clock },
    { name: "Appliances", icon: Tv },
    { name: "Toys & Kids", icon: Users },
    { name: "Kitchen", icon: Utensils },
    { name: "Books", icon: BookOpen },
  ];
  
  const handleCategoryClick = (category: string) => {
    navigate(`/marketplace?category=${category.toLowerCase().replace(/\s+/g, '-')}`);
    
    if (onCategorySelect) {
      onCategorySelect(category.toLowerCase().replace(/\s+/g, '-'));
    }
  };
  
  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-4">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div 
              key={category.name}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-900/30 mb-2 transition-transform group-hover:scale-110">
                <Icon size={20} className="text-blue-400" />
              </div>
              <span className="text-xs text-center text-white">{category.name}</span>
            </div>
          )}
        )}
      </div>
    </div>
  );
};
