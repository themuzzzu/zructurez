
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  ShoppingBag, 
  Smartphone, 
  Heart, 
  Utensils, 
  BarChart3, 
  Home, 
  Factory, 
  Car, 
  Building2, 
  Laptop, 
  Wheat, 
  Shirt, 
  BookOpen, 
  Scissors, 
  Wrench, 
  Hammer, 
  GraduationCap, 
  Camera, 
  ActivitySquare, 
  Plane, 
  Scale 
} from "lucide-react";
import { motion } from "framer-motion";

interface CategoryProps {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const BusinessCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories: CategoryProps[] = [
    { id: "retail", name: "Retail & Local Shops", icon: <ShoppingBag className="h-4 w-4" /> },
    { id: "electronics", name: "Electronics & Mobile", icon: <Smartphone className="h-4 w-4" /> },
    { id: "healthcare", name: "Healthcare & Medical", icon: <Heart className="h-4 w-4" /> },
    { id: "food", name: "Food & Beverage", icon: <Utensils className="h-4 w-4" /> },
    { id: "wholesale", name: "Wholesale & Distributors", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "home-living", name: "Home & Living", icon: <Home className="h-4 w-4" /> },
    { id: "industrial", name: "Industrial & B2B", icon: <Factory className="h-4 w-4" /> },
    { id: "auto", name: "Auto & Transport", icon: <Car className="h-4 w-4" /> },
    { id: "real-estate", name: "Real Estate", icon: <Building2 className="h-4 w-4" /> },
    { id: "tech", name: "Tech & Digital", icon: <Laptop className="h-4 w-4" /> },
    { id: "agriculture", name: "Agriculture & Farming", icon: <Wheat className="h-4 w-4" /> },
    { id: "fashion", name: "Fashion & Lifestyle", icon: <Shirt className="h-4 w-4" /> },
    { id: "books", name: "Books & Education Stores", icon: <BookOpen className="h-4 w-4" /> },
    { id: "beauty", name: "Beauty & Personal Care", icon: <Scissors className="h-4 w-4" /> },
    { id: "home-services", name: "Home Services", icon: <Wrench className="h-4 w-4" /> },
    { id: "repairs", name: "Repairs & Maintenance", icon: <Hammer className="h-4 w-4" /> },
    { id: "education", name: "Education & Coaching", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "events", name: "Events & Photography", icon: <Camera className="h-4 w-4" /> },
    { id: "wellness", name: "Health & Wellness", icon: <ActivitySquare className="h-4 w-4" /> },
    { id: "travel", name: "Travel & Transport", icon: <Plane className="h-4 w-4" /> },
    { id: "legal", name: "Legal & Finance Services", icon: <Scale className="h-4 w-4" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/businesses?category=${categoryId}`);
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center justify-center min-w-[80px] p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-center line-clamp-2 h-8">{category.name}</span>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
