
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Tv, 
  Shirt, 
  Home, 
  Dumbbell, 
  BookOpen, 
  Baby, 
  Car,
  Music,
  SmartphoneCharging,
  Gift,
  Apple,
  Laptop,
  Camera,
  HeartPulse,
  PaintBucket
} from "lucide-react";
import { motion } from "framer-motion";
import { LazyImage } from "@/components/ui/LazyImage";

export const MarketplaceCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: "electronics", name: "Electronics", icon: <Tv className="h-4 w-4" />, image: "/lovable-uploads/d224251b-cd80-42dd-8a17-81cff4681698.png" },
    { id: "home-decor", name: "Home Decor", icon: <Home className="h-4 w-4" /> },
    { id: "fashion", name: "Fashion", icon: <Shirt className="h-4 w-4" /> },
    { id: "books", name: "Books", icon: <BookOpen className="h-4 w-4" /> },
    { id: "sports", name: "Sports", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "kids", name: "Kids & Toys", icon: <Baby className="h-4 w-4" /> },
    { id: "automotive", name: "Automotive", icon: <Car className="h-4 w-4" /> },
    { id: "music", name: "Music", icon: <Music className="h-4 w-4" /> },
    { id: "gadgets", name: "Gadgets", icon: <SmartphoneCharging className="h-4 w-4" /> },
    { id: "gifts", name: "Gifts", icon: <Gift className="h-4 w-4" /> },
    { id: "groceries", name: "Groceries", icon: <Apple className="h-4 w-4" /> },
    { id: "computers", name: "Computers", icon: <Laptop className="h-4 w-4" /> },
    { id: "cameras", name: "Cameras", icon: <Camera className="h-4 w-4" /> },
    { id: "health", name: "Health", icon: <HeartPulse className="h-4 w-4" /> },
    { id: "art", name: "Art", icon: <PaintBucket className="h-4 w-4" /> }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 mb-6 shadow-sm w-full overflow-hidden">
      <h3 className="text-lg font-semibold mb-3">Shop Products</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 w-full">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {category.image ? (
              <div className="w-6 h-6 rounded-full overflow-hidden mb-2">
                <LazyImage
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                {category.icon}
              </div>
            )}
            <span className="text-xs text-center line-clamp-1">{category.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
