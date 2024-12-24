import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { 
  Hospital, 
  Car, 
  UtensilsCrossed,
  Briefcase,
  Scissors,
  GraduationCap,
  Building2,
  ShoppingBag,
  Dumbbell,
  Home,
  Wrench,
  Heart
} from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: null },
  { id: "healthcare", name: "Healthcare", icon: Hospital },
  { id: "driving-school", name: "Driving Schools", icon: Car },
  { id: "restaurant", name: "Restaurants", icon: UtensilsCrossed },
  { id: "professional", name: "Professional Services", icon: Briefcase },
  { id: "salon", name: "Beauty & Salon", icon: Scissors },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "real-estate", name: "Real Estate", icon: Building2 },
  { id: "retail", name: "Retail", icon: ShoppingBag },
  { id: "fitness", name: "Fitness", icon: Dumbbell },
  { id: "home-services", name: "Home Services", icon: Home },
  { id: "maintenance", name: "Maintenance", icon: Wrench },
  { id: "wellness", name: "Wellness", icon: Heart },
];

export const BusinessCategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    toast.success(`Filtered by ${categories.find(c => c.id === categoryId)?.name}`);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide animate-fade-up">
      {categories.map(({ id, name, icon: Icon }) => (
        <Button
          key={id}
          variant={id === selectedCategory ? "default" : "outline"}
          className="whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md min-w-fit px-4"
          onClick={() => handleCategoryClick(id)}
        >
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {name}
        </Button>
      ))}
    </div>
  );
};