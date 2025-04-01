
import { useEffect, useState, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Shirt, Home, ShoppingBag, Utensils, Gift, Car, Camera, Heart, 
  Paintbrush, Leaf, Laptop, BookOpen, Dumbbell, Music, Baby, Sofa,
  Smartphone, Headphones, Tv, Watch, Tablet
} from "lucide-react";
import { motion } from "framer-motion";

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  trendingCategories?: string[];
  showAllCategories?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  clothing: <Shirt className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  electronics: <Laptop className="h-4 w-4" />,
  mobiles: <Smartphone className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  gifts: <Gift className="h-4 w-4" />,
  automotive: <Car className="h-4 w-4" />,
  photography: <Camera className="h-4 w-4" />,
  health: <Heart className="h-4 w-4" />,
  art: <Paintbrush className="h-4 w-4" />,
  beauty: <Leaf className="h-4 w-4" />,
  books: <BookOpen className="h-4 w-4" />,
  sports: <Dumbbell className="h-4 w-4" />,
  music: <Music className="h-4 w-4" />,
  baby: <Baby className="h-4 w-4" />,
  furniture: <Sofa className="h-4 w-4" />,
  headphones: <Headphones className="h-4 w-4" />,
  appliances: <Tv className="h-4 w-4" />,
  wearables: <Watch className="h-4 w-4" />,
  tablets: <Tablet className="h-4 w-4" />,
};

const categoryNames: Record<string, string> = {
  all: "All Categories",
  clothing: "Clothing & Fashion",
  electronics: "Electronics",
  mobiles: "Mobile Phones",
  home: "Home & Garden",
  beauty: "Beauty & Personal Care",
  sports: "Sports & Outdoors",
  toys: "Toys & Games",
  books: "Books & Media",
  health: "Health & Wellness",
  jewelry: "Jewelry & Accessories",
  automotive: "Automotive",
  pet: "Pet Supplies",
  grocery: "Grocery & Food",
  furniture: "Furniture",
  art: "Art & Collectibles",
  music: "Music & Instruments",
  baby: "Baby & Kids",
  photography: "Photography",
  appliances: "Appliances",
  wearables: "Wearables",
  headphones: "Headphones",
  tablets: "Tablets & iPads",
};

// Define subcategories for main categories
const subCategories: Record<string, string[]> = {
  clothing: ["Men's Fashion", "Women's Fashion", "Kids' Fashion", "Ethnic Wear", "Footwear"],
  electronics: ["Smartphones", "Laptops", "Cameras", "Audio", "Gaming", "Computer Accessories"],
  home: ["Furniture", "Kitchen", "Decor", "Bedding", "Bath", "Garden"],
  furniture: ["Living Room", "Bedroom", "Dining", "Office", "Kids Room", "Outdoor"],
  toys: ["Educational", "Action Figures", "Board Games", "Plush Toys", "Baby Toys", "Outdoor Toys"],
};

export const Categories = ({ 
  onCategorySelect, 
  trendingCategories = [],
  showAllCategories = false 
}: CategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showSubcategories, setShowSubcategories] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
    
    // Show subcategories if they exist for this category
    if (subCategories[category] && subCategories[category].length > 0) {
      setCurrentCategory(category);
      setShowSubcategories(true);
    } else {
      setShowSubcategories(false);
    }
  };
  
  // If trending categories are empty, use the predefined list
  const categories = trendingCategories.length > 0 
    ? ["all", ...trendingCategories] 
    : ["all", "clothing", "electronics", "mobiles", "home", "beauty", "sports", "toys", "books", "health", "jewelry", "automotive", "pet", "grocery", "furniture", "art", "music", "baby", "photography", "appliances", "wearables", "headphones", "tablets"];
  
  // For showing all categories
  const allCategories = showAllCategories 
    ? Object.keys(categoryNames) 
    : categories;

  return (
    <div className="py-3">
      <h2 className="text-lg font-semibold mb-3 px-1">Browse by Category</h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-4">
          {allCategories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant="outline"
                className={cn(
                  "h-9 px-4 py-2 cursor-pointer whitespace-nowrap border border-gray-200 dark:border-gray-700 transition-all duration-300",
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-background hover:bg-accent/50 transition-colors'
                )}
                onClick={() => handleCategoryClick(category)}
              >
                {categoryIcons[category] && (
                  <span className="mr-2">{categoryIcons[category]}</span>
                )}
                {categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Subcategories */}
      {showSubcategories && subCategories[currentCategory] && (
        <div className="mt-4">
          <ScrollArea className="w-full">
            <div className="flex space-x-2 pb-4">
              {subCategories[currentCategory].map((subcategory) => (
                <motion.div
                  key={subcategory}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    className="h-8 px-3 py-1.5 cursor-pointer whitespace-nowrap border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    onClick={() => onCategorySelect(`${currentCategory}-${subcategory.toLowerCase().replace(/[' ]/g, '-')}`)}
                  >
                    {subcategory}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
