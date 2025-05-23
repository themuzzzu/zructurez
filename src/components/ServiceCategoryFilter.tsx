
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
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
  Wifi,
  Car,
  UtensilsCrossed,
  Baby,
  Flower2,
  Music2,
  Dumbbell,
  Stethoscope
} from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: null },
  { id: "plumbing", name: "Plumbing", icon: Wrench },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "computer-repair", name: "Computer Repair", icon: Computer },
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
  { id: "internet", name: "Internet Services", icon: Wifi },
  { id: "automotive", name: "Automotive", icon: Car },
  { id: "catering", name: "Catering", icon: UtensilsCrossed },
  { id: "childcare", name: "Childcare", icon: Baby },
  { id: "gardening", name: "Gardening", icon: Flower2 },
  { id: "music", name: "Music Lessons", icon: Music2 },
  { id: "fitness", name: "Fitness Training", icon: Dumbbell },
  { id: "healthcare", name: "Healthcare", icon: Stethoscope }
];

interface ServiceCategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export const ServiceCategoryFilter = ({ onCategoryChange }: ServiceCategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    toast.success(`Filtered by ${categoryName}`);
  };

  useEffect(() => {
    // Initialize with "all" category
    onCategoryChange(selectedCategory);
  }, []);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-3 md:px-4 scrollbar-hide animate-fade-up rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 shadow-sm -mx-2 sm:mx-0">
      <div className="flex gap-3 overflow-x-auto w-full pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
        {categories.map(({ id, name, icon: Icon }) => (
          <Button
            key={id}
            variant={id === selectedCategory ? "default" : "outline"}
            className="whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md min-w-fit px-3 sm:px-4 flex-shrink-0 snap-start"
            onClick={() => handleCategoryClick(id)}
          >
            {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};
