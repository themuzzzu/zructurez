
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
  Dog,
  Building
} from 'lucide-react';
import { motion } from "framer-motion";
import { LazyImage } from "@/components/ui/LazyImage";
import { useTrackRender } from "@/utils/performanceUtils";
import { prefetchData } from "@/utils/apiPerformance";
import { useEffect } from 'react';

export function ServiceCategoryScroller() {
  // Track render performance
  useTrackRender("ServiceCategoryScroller");

  const navigate = useNavigate();

  const categories = [
    { id: 'ac-repair', name: 'AC Repair', icon: <Zap className="h-4 w-4 text-blue-500" /> },
    { id: 'plumbing', name: 'Plumbing', icon: <Wrench className="h-4 w-4 text-green-500" /> },
    { id: 'home-renovation', name: 'Home Renovation', icon: <Home className="h-4 w-4 text-purple-500" /> },
    { id: 'real-estate', name: 'Real Estate', icon: <Building className="h-4 w-4 text-blue-400" /> },
    { id: 'cleaning', name: 'Cleaning', icon: <Home className="h-4 w-4 text-yellow-500" /> },
    { id: 'electrician', name: 'Electrician', icon: <Zap className="h-4 w-4 text-orange-500" /> },
    { id: 'computer-repair', name: 'Computer Repair', icon: <Computer className="h-4 w-4 text-indigo-500" /> },
    { id: 'beauty', name: 'Beauty Services', icon: <Scissors className="h-4 w-4 text-pink-500" /> },
    { id: 'moving', name: 'Moving Services', icon: <Truck className="h-4 w-4 text-teal-500" /> },
    { id: 'painting', name: 'Painting', icon: <PaintBucket className="h-4 w-4 text-red-500" /> },
    { id: 'pest-control', name: 'Pest Control', icon: <Bug className="h-4 w-4 text-lime-500" /> },
    { id: 'photography', name: 'Photography', icon: <Camera className="h-4 w-4 text-amber-500" /> },
  ];

  // Prefetch popular service data
  useEffect(() => {
    // Prefetch data for most common service categories
    const topCategories = ['ac-repair', 'plumbing', 'cleaning'];
    
    topCategories.forEach(category => {
      prefetchData(
        `services-${category}`,
        `services:${category}`,
        5 * 60 * 1000, // 5 minute cache
        async () => {
          // This would be replaced with your actual data fetching logic
          return { data: [], status: "success" };
        },
        'low' // Low priority prefetch
      );
    });
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="bg-[#1f2937] dark:bg-zinc-900 rounded-lg p-3 mb-5">
      <h3 className="text-lg font-semibold mb-2 text-white">Services</h3>
      <ScrollArea className="w-full overflow-hidden">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex flex-col items-center cursor-pointer group min-w-[65px] bg-[#1b2430] rounded-lg p-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1">
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

// Export as named and default export for flexibility with dynamic imports
export default ServiceCategoryScroller;
