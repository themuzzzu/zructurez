
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Building
} from 'lucide-react';
import { motion } from "framer-motion";

export function ServiceCategoryScroller() {
  const navigate = useNavigate();

  const categories = [
    { id: 'ac-repair', name: 'AC Repair', icon: <Zap className="h-6 w-6 text-blue-500" /> },
    { id: 'plumbing', name: 'Plumbing', icon: <Wrench className="h-6 w-6 text-green-500" /> },
    { id: 'home-renovation', name: 'Home Renovation', icon: <Home className="h-6 w-6 text-purple-500" /> },
    { id: 'real-estate', name: 'Real Estate', icon: <Building className="h-6 w-6 text-blue-400" /> },
    { id: 'cleaning', name: 'Cleaning', icon: <Home className="h-6 w-6 text-yellow-500" /> },
    { id: 'electrician', name: 'Electrician', icon: <Zap className="h-6 w-6 text-orange-500" /> },
    { id: 'computer-repair', name: 'Computer Repair', icon: <Computer className="h-6 w-6 text-indigo-500" /> },
    { id: 'beauty', name: 'Beauty Services', icon: <Scissors className="h-6 w-6 text-pink-500" /> },
    { id: 'moving', name: 'Moving Services', icon: <Truck className="h-6 w-6 text-teal-500" /> },
    { id: 'painting', name: 'Painting', icon: <PaintBucket className="h-6 w-6 text-red-500" /> },
    { id: 'pest-control', name: 'Pest Control', icon: <Bug className="h-6 w-6 text-lime-500" /> },
    { id: 'photography', name: 'Photography', icon: <Camera className="h-6 w-6 text-amber-500" /> },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="bg-[#1f2937] dark:bg-zinc-900 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
      <ScrollArea className="w-full scrollbar-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 pb-4">
          {categories.slice(0, 8).map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center cursor-pointer group bg-[#1b2430] rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                {category.icon}
              </div>
              <span className="text-sm text-center text-white">{category.name}</span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
