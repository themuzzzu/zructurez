
import { useNavigate } from 'react-router-dom';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  Dog 
} from 'lucide-react';
import { motion } from "framer-motion";

export function ServiceCategoryScroller() {
  const navigate = useNavigate();

  const categories = [
    { id: 'cleaning', name: 'Cleaning', icon: <Home className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'plumbing', name: 'Plumbing', icon: <Wrench className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'electrician', name: 'Electrician', icon: <Zap className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'computer-repair', name: 'Computer Repair', icon: <Computer className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'beauty', name: 'Beauty Services', icon: <Scissors className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'moving', name: 'Moving Services', icon: <Truck className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'painting', name: 'Painting', icon: <PaintBucket className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'pest-control', name: 'Pest Control', icon: <Bug className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'photography', name: 'Photography', icon: <Camera className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'laundry', name: 'Laundry', icon: <Shirt className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'wellness', name: 'Wellness', icon: <Heart className="h-4 w-4" />, image: "/placeholder.svg" },
    { id: 'pet-care', name: 'Pet Care', icon: <Dog className="h-4 w-4" />, image: "/placeholder.svg" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Service Categories</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center cursor-pointer min-w-[100px] group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-xs text-center line-clamp-2">{category.name}</span>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
