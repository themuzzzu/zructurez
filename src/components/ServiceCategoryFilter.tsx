import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Wrench,
  Zap,
  Computer,
  Scissors,
  Home,
  Truck,
  PaintBucket,
  Bug,
  Camera,
  Shirt,
  Heart,
  Dog,
  BookOpen,
  Wifi
} from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: null },
  { id: "plumbing", name: "Plumbing", icon: Wrench },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "computer", name: "Computer Repair", icon: Computer },
  { id: "beauty", name: "Beauty Services", icon: Scissors },
  { id: "cleaning", name: "Home Cleaning", icon: Home },
  { id: "moving", name: "Moving Services", icon: Truck },
  { id: "painting", name: "Painting", icon: PaintBucket },
  { id: "pest-control", name: "Pest Control", icon: Bug },
  { id: "photography", name: "Photography", icon: Camera },
  { id: "laundry", name: "Laundry", icon: Shirt },
  { id: "wellness", name: "Wellness", icon: Heart },
  { id: "pet-care", name: "Pet Care", icon: Dog },
  { id: "tutoring", name: "Tutoring", icon: BookOpen },
  { id: "internet", name: "Internet Services", icon: Wifi }
];

export const ServiceCategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    toast.success(`Filtered by ${categories.find(c => c.id === categoryId)?.name}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide animate-fade-up">
      {categories.map(({ id, name, icon: Icon }) => (
        <Button
          key={id}
          variant={id === selectedCategory ? "default" : "outline"}
          className="whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md"
          onClick={() => handleCategoryClick(id)}
        >
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {name}
        </Button>
      ))}
    </div>
  );
};