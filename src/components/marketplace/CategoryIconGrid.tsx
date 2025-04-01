
import { useNavigate } from "react-router-dom";
import { 
  Smartphone, 
  ShoppingBag, 
  Home, 
  Clock, 
  Tv, 
  Users, 
  Utensils,
  BookOpen,
  Laptop,
  Headphones,
  Camera,
  Watch,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Sofa
} from "lucide-react";

interface CategoryIconGridProps {
  onCategorySelect?: (category: string) => void;
}

export const CategoryIconGrid = ({ onCategorySelect }: CategoryIconGridProps) => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Electronics", icon: Smartphone, subcategories: ["Mobile Phones", "Laptops & Computers", "Audio", "Cameras", "Wearables", "Accessories"] },
    { name: "Fashion", icon: ShoppingBag, subcategories: ["Men's Clothing", "Women's Clothing", "Footwear", "Watches & Eyewear", "Jewelry"] },
    { name: "Home & Furniture", icon: Home, subcategories: ["Furniture", "Home Decor", "Lighting"] },
    { name: "Watches", icon: Clock, subcategories: ["Analog", "Digital", "Smart Watches", "Luxury", "Sports"] },
    { name: "Appliances", icon: Tv, subcategories: ["Kitchen Appliances", "Home Appliances"] },
    { name: "Toys & Kids", icon: Users, subcategories: ["Toys", "Kids Fashion"] },
    { name: "Kitchen", icon: Utensils, subcategories: ["Cookware", "Utensils", "Appliances", "Tableware", "Storage", "Bakeware"] },
    { name: "Books", icon: BookOpen, subcategories: ["Fiction", "Non-Fiction", "Educational", "Comics"] },
  ];
  
  const handleCategoryClick = (category: string) => {
    // Navigate directly to a dedicated category page
    navigate(`/products?category=${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`);
    
    if (onCategorySelect) {
      onCategorySelect(category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, ''));
    }
  };
  
  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-4 px-3 sm:px-4 md:px-6">
      <h2 className="text-xl font-bold mb-4 text-white">Categories</h2>
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div 
              key={category.name}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-900/30 mb-2">
                <Icon size={20} className="text-blue-400" />
              </div>
              <span className="text-xs text-center text-white">{category.name}</span>
            </div>
          )}
        )}
      </div>
    </div>
  );
};
