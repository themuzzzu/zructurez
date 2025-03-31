
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  ShoppingBag, 
  HeartPulse, 
  Home, 
  Utensils, 
  Shirt, 
  Smartphone, 
  Bicycle, 
  Baby, 
  Paintbrush, 
  Briefcase, 
  MoreHorizontal 
} from "lucide-react";

interface CategoriesProps {
  onCategorySelect?: (category: string) => void;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const Categories = ({ onCategorySelect }: CategoriesProps) => {
  const navigate = useNavigate();

  const categories: Category[] = [
    { id: "all", name: "All Products", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "health", name: "Health & Beauty", icon: <HeartPulse className="h-5 w-5" /> },
    { id: "home", name: "Home & Garden", icon: <Home className="h-5 w-5" /> },
    { id: "food", name: "Food & Grocery", icon: <Utensils className="h-5 w-5" /> },
    { id: "fashion", name: "Fashion", icon: <Shirt className="h-5 w-5" /> },
    { id: "electronics", name: "Electronics", icon: <Smartphone className="h-5 w-5" /> },
    { id: "sports", name: "Sports & Outdoors", icon: <Bicycle className="h-5 w-5" /> },
    { id: "kids", name: "Kids & Babies", icon: <Baby className="h-5 w-5" /> },
    { id: "art", name: "Art & Crafts", icon: <Paintbrush className="h-5 w-5" /> },
    { id: "business", name: "Business", icon: <Briefcase className="h-5 w-5" /> },
    { id: "other", name: "Other Categories", icon: <MoreHorizontal className="h-5 w-5" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      navigate(`/marketplace?category=${categoryId}`);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className="p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-accent transition-colors"
          onClick={() => handleCategoryClick(category.id)}
        >
          <div className="p-2 rounded-full bg-primary/10">
            {category.icon}
          </div>
          <span className="text-sm font-medium">{category.name}</span>
        </Card>
      ))}
    </div>
  );
};
