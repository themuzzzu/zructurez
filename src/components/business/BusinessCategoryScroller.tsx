import { useNavigate } from "react-router-dom";
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
import { LazyImage } from "@/components/ui/LazyImage";

interface CategoryProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  image?: string;
}

export const BusinessCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories: CategoryProps[] = [
    { id: "retail", name: "Retail & Local Shops", icon: <ShoppingBag className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "electronics", name: "Electronics & Mobile", icon: <Smartphone className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "healthcare", name: "Healthcare & Medical", icon: <Heart className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "food", name: "Food & Beverage", icon: <Utensils className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "wholesale", name: "Wholesale & Distributors", icon: <BarChart3 className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "home-living", name: "Home & Living", icon: <Home className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "industrial", name: "Industrial & B2B", icon: <Factory className="h-4 w-4" />, image: "/lovable-uploads/9a155fb9-4d56-4192-b7f2-9b810ca09e5e.png" },
    { id: "auto", name: "Auto & Transport", icon: <Car className="h-4 w-4" />, image: "/lovable-uploads/aa0358a3-f8ba-4fe8-a5b0-6a588bfda79e.png" },
    { id: "real-estate", name: "Real Estate", icon: <Building2 className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "tech", name: "Tech & Digital", icon: <Laptop className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "agriculture", name: "Agriculture & Farming", icon: <Wheat className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "fashion", name: "Fashion & Lifestyle", icon: <Shirt className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "books", name: "Books & Education Stores", icon: <BookOpen className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "beauty", name: "Beauty & Personal Care", icon: <Scissors className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "home-services", name: "Home Services", icon: <Wrench className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "repairs", name: "Repairs & Maintenance", icon: <Hammer className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "education", name: "Education & Coaching", icon: <GraduationCap className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "events", name: "Events & Photography", icon: <Camera className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "wellness", name: "Health & Wellness", icon: <ActivitySquare className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "travel", name: "Travel & Transport", icon: <Plane className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: "legal", name: "Legal & Finance Services", icon: <Scale className="h-4 w-4" />, image: "/placeholder.svg" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Category clicked: ${categoryId}`);
    navigate(`/businesses?category=${categoryId}`);
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              {category.icon}
            </div>
            <span className="text-xs text-center line-clamp-2 h-8">{category.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
