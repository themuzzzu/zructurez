
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageFallback } from "@/components/ui/image-fallback";
import { motion } from "framer-motion";
import { 
  Wrench, 
  Droplet, 
  Home, 
  Building2, 
  Phone, 
  Car, 
  BookOpen, 
  Scissors 
} from "lucide-react";

export const ServiceCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: "repair", name: "Repairs", icon: <Wrench className="h-4 w-4 text-blue-400" /> },
    { id: "plumbing", name: "Plumbing", icon: <Droplet className="h-4 w-4 text-cyan-400" /> },
    { id: "home-services", name: "Home", icon: <Home className="h-4 w-4 text-green-400" /> },
    { id: "real-estate", name: "Real Estate", icon: <Building2 className="h-4 w-4 text-amber-400" /> },
    { id: "electronics", name: "Electronics", icon: <Phone className="h-4 w-4 text-red-400" /> },
    { id: "automotive", name: "Automotive", icon: <Car className="h-4 w-4 text-orange-400" /> },
    { id: "education", name: "Education", icon: <BookOpen className="h-4 w-4 text-purple-400" /> },
    { id: "beauty", name: "Beauty", icon: <Scissors className="h-4 w-4 text-pink-400" /> }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-2 sm:p-3">
      <h3 className="text-lg font-semibold mb-1 sm:mb-2 text-white px-1">Find Services</h3>
      <ScrollArea className="w-full overflow-hidden">
        <div className="flex gap-1 pb-1 sm:gap-2 sm:pb-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center cursor-pointer group min-w-[55px] sm:min-w-[65px] bg-[#1b2430] rounded-lg p-1.5 sm:p-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                {category.icon}
              </div>
              <span className="text-[10px] sm:text-xs text-center text-white line-clamp-1">{category.name}</span>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};
