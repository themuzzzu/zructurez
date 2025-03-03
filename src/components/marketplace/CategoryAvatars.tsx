
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingBag, 
  Smartphone, 
  Tv, 
  Laptop, 
  Shirt, 
  Baby, 
  Home, 
  BookOpen, 
  Dumbbell, 
  Utensils, 
  Car, 
  Gift
} from "lucide-react";
import { useState } from "react";

interface CategoryAvatarsProps {
  onCategorySelect: (category: string) => void;
}

export const CategoryAvatars = ({ onCategorySelect }: CategoryAvatarsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { id: "electronics", name: "Electronics", icon: <Smartphone className="h-8 w-8" />, color: "bg-blue-100" },
    { id: "mobiles", name: "Mobiles", icon: <Smartphone className="h-8 w-8" />, color: "bg-green-100" },
    { id: "tvs", name: "TVs & Appliances", icon: <Tv className="h-8 w-8" />, color: "bg-purple-100" },
    { id: "fashion", name: "Fashion", icon: <Shirt className="h-8 w-8" />, color: "bg-pink-100" },
    { id: "computers", name: "Computers", icon: <Laptop className="h-8 w-8" />, color: "bg-yellow-100" },
    { id: "baby", name: "Baby & Kids", icon: <Baby className="h-8 w-8" />, color: "bg-red-100" },
    { id: "home", name: "Home & Furniture", icon: <Home className="h-8 w-8" />, color: "bg-indigo-100" },
    { id: "books", name: "Books & Education", icon: <BookOpen className="h-8 w-8" />, color: "bg-orange-100" },
    { id: "sports", name: "Sports & Fitness", icon: <Dumbbell className="h-8 w-8" />, color: "bg-teal-100" },
    { id: "grocery", name: "Grocery", icon: <Utensils className="h-8 w-8" />, color: "bg-lime-100" },
    { id: "auto", name: "Auto Accessories", icon: <Car className="h-8 w-8" />, color: "bg-cyan-100" },
    { id: "gifts", name: "Gifts & Toys", icon: <Gift className="h-8 w-8" />, color: "bg-rose-100" },
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };
  
  return (
    <ScrollArea className="w-full pb-4">
      <div className="flex space-x-6 pb-4 px-2">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => handleCategoryClick(category.id)}
          >
            <Avatar className={`w-16 h-16 ${category.color} p-2 group-hover:scale-110 transition-transform duration-200 ${selectedCategory === category.id ? 'ring-2 ring-primary' : ''}`}>
              <AvatarImage src="" alt={category.name} />
              <AvatarFallback className={`${category.color} text-primary`}>
                {category.icon}
              </AvatarFallback>
            </Avatar>
            <span className="mt-2 text-xs text-center font-medium max-w-[80px] line-clamp-2">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
