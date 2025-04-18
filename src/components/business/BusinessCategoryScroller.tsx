
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Store, 
  Building2, 
  Utensils, 
  ShoppingBag, 
  Package, 
  Factory, 
  Building, 
  GraduationCap 
} from "lucide-react";
import { motion } from "framer-motion";

export const BusinessCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: "retail", name: "Local Shops", icon: <Store className="h-4 w-4 text-blue-400" /> },
    { id: "real-estate", name: "Real Estate", icon: <Building2 className="h-4 w-4 text-green-400" /> },
    { id: "restaurants", name: "Food", icon: <Utensils className="h-4 w-4 text-orange-400" /> },
    { id: "fashion", name: "Fashion", icon: <ShoppingBag className="h-4 w-4 text-pink-400" /> },
    { id: "wholesale", name: "Wholesale", icon: <Package className="h-4 w-4 text-amber-400" /> },
    { id: "industrial", name: "Industrial", icon: <Factory className="h-4 w-4 text-slate-400" /> },
    { id: "commercial", name: "Commercial", icon: <Building className="h-4 w-4 text-purple-400" /> },
    { id: "education", name: "Education", icon: <GraduationCap className="h-4 w-4 text-cyan-400" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/business?category=${categoryId}`);
  };

  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-3 mb-5">
      <h3 className="text-lg font-semibold mb-3 text-white">Explore Businesses</h3>
      <ScrollArea className="w-full overflow-hidden">
        <div className="flex gap-3 pb-3">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center cursor-pointer group min-w-[70px] bg-[#1b2430] rounded-lg p-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-center text-white line-clamp-1">{category.name}</span>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
