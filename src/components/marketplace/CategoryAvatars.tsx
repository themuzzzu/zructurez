
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryAvatarsProps {
  onCategorySelect: (category: string) => void;
}

export const CategoryAvatars = ({ onCategorySelect }: CategoryAvatarsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { id: "electronics", name: "Electronics", icon: <Smartphone className="h-8 w-8" />, color: "bg-blue-100/10 text-blue-400 dark:text-blue-300" },
    { id: "mobiles", name: "Mobiles", icon: <Smartphone className="h-8 w-8" />, color: "bg-green-100/10 text-green-400 dark:text-green-300" },
    { id: "tvs", name: "TVs & Appliances", icon: <Tv className="h-8 w-8" />, color: "bg-purple-100/10 text-purple-400 dark:text-purple-300" },
    { id: "fashion", name: "Fashion", icon: <Shirt className="h-8 w-8" />, color: "bg-pink-100/10 text-pink-400 dark:text-pink-300" },
    { id: "computers", name: "Computers", icon: <Laptop className="h-8 w-8" />, color: "bg-yellow-100/10 text-yellow-400 dark:text-yellow-300" },
    { id: "baby", name: "Baby & Kids", icon: <Baby className="h-8 w-8" />, color: "bg-red-100/10 text-red-400 dark:text-red-300" },
    { id: "home", name: "Home & Furniture", icon: <Home className="h-8 w-8" />, color: "bg-indigo-100/10 text-indigo-400 dark:text-indigo-300" },
    { id: "books", name: "Books & Education", icon: <BookOpen className="h-8 w-8" />, color: "bg-orange-100/10 text-orange-400 dark:text-orange-300" },
    { id: "sports", name: "Sports & Fitness", icon: <Dumbbell className="h-8 w-8" />, color: "bg-teal-100/10 text-teal-400 dark:text-teal-300" },
    { id: "grocery", name: "Grocery", icon: <Utensils className="h-8 w-8" />, color: "bg-lime-100/10 text-lime-400 dark:text-lime-300" },
    { id: "auto", name: "Auto Accessories", icon: <Car className="h-8 w-8" />, color: "bg-cyan-100/10 text-cyan-400 dark:text-cyan-300" },
    { id: "gifts", name: "Gifts & Toys", icon: <Gift className="h-8 w-8" />, color: "bg-rose-100/10 text-rose-400 dark:text-rose-300" },
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    // Deselect if clicking the same category
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    onCategorySelect(newCategory || 'all'); // Pass 'all' when deselecting
  };
  
  return (
    <div className="w-full bg-card rounded-lg p-4 shadow-sm border border-border">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8">
              <div 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleCategoryClick(category.id)}
              >
                <Avatar className={`w-16 h-16 ${category.color} p-2 group-hover:scale-110 transition-transform duration-200 ${selectedCategory === category.id ? 'ring-2 ring-primary shadow-md' : ''}`}>
                  <AvatarImage src="" alt={category.name} />
                  <AvatarFallback className={category.color}>
                    {category.icon}
                  </AvatarFallback>
                </Avatar>
                <span className="mt-2 text-xs text-center font-medium max-w-[80px] line-clamp-2 text-foreground dark:text-white">
                  {category.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <CarouselNext className="bg-background shadow-md dark:bg-card" />
        </div>
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
          <CarouselPrevious className="bg-background shadow-md dark:bg-card" />
        </div>
      </Carousel>
    </div>
  );
};
