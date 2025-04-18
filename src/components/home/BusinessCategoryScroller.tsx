
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
  Wrench 
} from "lucide-react";
import { motion } from "framer-motion";

export const BusinessCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: "retail",
      name: "Retail",
      icon: <ShoppingBag className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: <Smartphone className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: <Heart className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "food",
      name: "Food & Beverage",
      icon: <Utensils className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "wholesale",
      name: "Wholesale",
      icon: <BarChart3 className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "home-living",
      name: "Home Living",
      icon: <Home className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "industrial-b2b",
      name: "Industrial & B2B",
      icon: <Factory className="h-4 w-4" />,
      image: "/lovable-uploads/9a155fb9-4d56-4192-b7f2-9b810ca09e5e.png"
    },
    {
      id: "auto-transport",
      name: "Auto & Transport",
      icon: <Car className="h-4 w-4" />,
      image: "/lovable-uploads/aa0358a3-f8ba-4fe8-a5b0-6a588bfda79e.png"
    },
    {
      id: "real-estate",
      name: "Real Estate",
      icon: <Building2 className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "tech",
      name: "Tech & Digital",
      icon: <Laptop className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "agriculture",
      name: "Agriculture",
      icon: <Wheat className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: <Shirt className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "books",
      name: "Books",
      icon: <BookOpen className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "beauty",
      name: "Beauty",
      icon: <Scissors className="h-4 w-4" />,
      image: "/placeholder.svg"
    },
    {
      id: "home-services",
      name: "Home Services",
      icon: <Wrench className="h-4 w-4" />,
      image: "/placeholder.svg"
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/businesses?category=${categoryId}`);
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm w-full overflow-hidden">
      <h3 className="text-lg font-semibold mb-3">Browse by Category</h3>
      <ScrollArea className="w-full overflow-x-auto">
        <div className="flex gap-3 pb-4 min-w-max overflow-visible">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center cursor-pointer min-w-[100px] max-w-[120px] group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mb-2">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all" />
              </div>
              <span className="text-xs text-center w-full line-clamp-2">{category.name}</span>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0 sm:opacity-100" />
      </ScrollArea>
    </div>
  );
};
