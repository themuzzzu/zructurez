
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
    <div className="w-full bg-white rounded-lg p-4 shadow-sm">
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
                  <AvatarFallback className={`${category.color} text-primary`}>
                    {category.icon}
                  </AvatarFallback>
                </Avatar>
                <span className="mt-2 text-xs text-center font-medium max-w-[80px] line-clamp-2">
                  {category.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <CarouselNext className="bg-white shadow-md" />
        </div>
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
          <CarouselPrevious className="bg-white shadow-md" />
        </div>
      </Carousel>
    </div>
  );
};
