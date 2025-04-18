
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ImageFallback } from "@/components/ui/image-fallback";
import { motion } from "framer-motion";

export const MarketplaceCategoryScroller = () => {
  const navigate = useNavigate();
  
  const categories = [
    { 
      id: "electronics", 
      name: "Electronics", 
      image: "/lovable-uploads/d01039d6-6bee-4097-9c23-8981fd856e92.png",
    },
    { 
      id: "fashion", 
      name: "Fashion", 
      image: "/lovable-uploads/db350618-6a6d-4b77-9761-78b2c5a9d56e.png",
    },
    { 
      id: "furniture", 
      name: "Furniture", 
      image: "/lovable-uploads/46a5e835-fcad-4044-8ca3-a3b617d56afd.png",
    },
    { 
      id: "beauty", 
      name: "Beauty", 
      image: "/lovable-uploads/bbbc13ee-6ebf-4bb8-b472-95ef720eed0c.png",
    },
    { 
      id: "toys", 
      name: "Toys & Kids", 
      image: "/lovable-uploads/232b303d-8292-4874-957a-e46de1d74c41.png",
    },
    { 
      id: "sports", 
      name: "Sports", 
      image: "/lovable-uploads/0c11e8d4-b796-449e-a507-165623e30fc7.png",
    },
    { 
      id: "health", 
      name: "Health", 
      image: "/lovable-uploads/e31366a1-6fb7-4cc0-8fb3-de640eed4826.png",
    },
    { 
      id: "gifts", 
      name: "Gifts", 
      image: "/lovable-uploads/1f522bd7-0eef-456b-bf41-542ae4239826.png",
    }
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/marketplace?category=${categoryId}`);
  };

  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-3 mb-5">
      <h3 className="text-lg font-semibold mb-2 text-white">Shop Products</h3>
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
              <div className="w-8 h-8 rounded-full overflow-hidden mb-1">
                <ImageFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  fallbackSrc="/placeholders/image-placeholder.jpg"
                />
              </div>
              <span className="text-xs text-center text-white line-clamp-1">{category.name}</span>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};
