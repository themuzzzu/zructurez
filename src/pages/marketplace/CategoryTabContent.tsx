
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Tv,
  Shirt,
  Laptop,
  Baby,
  Home,
  BookOpen,
  Dumbbell,
  Utensils
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface CategoryTabContentProps {
  setSelectedCategory: (category: string) => void;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const CategoryTabContent = ({ setSelectedCategory, setActiveTab }: CategoryTabContentProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Individual category cards here */}
      {[
        { name: "Electronics", icon: <Smartphone className="h-8 w-8" />, count: 2345 },
        { name: "Mobiles", icon: <Smartphone className="h-8 w-8" />, count: 1876 },
        { name: "TVs & Appliances", icon: <Tv className="h-8 w-8" />, count: 932 },
        { name: "Fashion", icon: <Shirt className="h-8 w-8" />, count: 4521 },
        { name: "Computers", icon: <Laptop className="h-8 w-8" />, count: 753 },
        { name: "Baby & Kids", icon: <Baby className="h-8 w-8" />, count: 621 },
        { name: "Home & Furniture", icon: <Home className="h-8 w-8" />, count: 1423 },
        { name: "Books & Education", icon: <BookOpen className="h-8 w-8" />, count: 532 },
        { name: "Sports & Fitness", icon: <Dumbbell className="h-8 w-8" />, count: 345 },
        { name: "Grocery", icon: <Utensils className="h-8 w-8" />, count: 986 },
      ].map((cat, idx) => (
        <div 
          key={idx} 
          className="bg-card border border-border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            setSelectedCategory(cat.name.toLowerCase().replace(/\s+/g, '-'));
            setActiveTab("search");
          }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            {cat.icon}
          </div>
          <h3 className="font-medium text-foreground text-center">{cat.name}</h3>
          <span className="text-sm text-muted-foreground">{cat.count} items</span>
        </div>
      ))}
    </div>
  );
};
