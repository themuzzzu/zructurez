
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Smartphone, 
  Shirt, 
  Tv, 
  PaintBucket, 
  Home, 
  Baby, 
  BookOpen, 
  Dumbbell, 
  Wrench 
} from "lucide-react";

interface CategoryProps {
  onCategorySelect?: (category: string) => void;
}

export const ShopByCategory = ({ onCategorySelect }: CategoryProps) => {
  const navigate = useNavigate();
  
  // Define categories with icons and slugs
  const categories = [
    { 
      name: "Groceries", 
      slug: "groceries", 
      icon: <ShoppingBag className="w-12 h-12 stroke-[1.5] text-emerald-600" />,
      subcategories: ["Rice", "Oil", "Fruits", "Dairy"]
    },
    { 
      name: "Electronics", 
      slug: "electronics", 
      icon: <Smartphone className="w-12 h-12 stroke-[1.5] text-blue-500" />,
      subcategories: ["Phones", "Laptops", "Audio", "Accessories"]
    },
    { 
      name: "Clothing", 
      slug: "clothing", 
      icon: <Shirt className="w-12 h-12 stroke-[1.5] text-orange-500" />,
      subcategories: ["Men", "Women", "Kids", "Ethnic"]
    },
    { 
      name: "Beauty & Personal Care", 
      slug: "beauty-personal-care", 
      icon: <PaintBucket className="w-12 h-12 stroke-[1.5] text-pink-500" />,
      subcategories: ["Makeup", "Haircare", "Skin"]
    },
    { 
      name: "Home & Living", 
      slug: "home-living", 
      icon: <Home className="w-12 h-12 stroke-[1.5] text-amber-500" />,
      subcategories: ["Decor", "Cookware", "Furniture", "Storage"]
    },
    { 
      name: "Health & Wellness", 
      slug: "health-wellness", 
      icon: <Tv className="w-12 h-12 stroke-[1.5] text-green-600" />,
      subcategories: ["Medicines", "Ayurveda", "First Aid"]
    },
    { 
      name: "Baby & Kids", 
      slug: "baby-kids", 
      icon: <Baby className="w-12 h-12 stroke-[1.5] text-brown-500" />,
      subcategories: ["Diapers", "Toys", "Baby Food"]
    },
    { 
      name: "Stationery & Office", 
      slug: "stationery-office", 
      icon: <BookOpen className="w-12 h-12 stroke-[1.5] text-gray-600" />,
      subcategories: ["Pens", "Notebooks", "Art Supplies"]
    },
    { 
      name: "Sports & Fitness", 
      slug: "sports-fitness", 
      icon: <Dumbbell className="w-12 h-12 stroke-[1.5] text-blue-600" />,
      subcategories: ["Dumbbells", "Yoga Mats", "Sportswear"]
    },
    { 
      name: "Tools & Hardware", 
      slug: "tools-hardware", 
      icon: <Wrench className="w-12 h-12 stroke-[1.5] text-gray-700" />,
      subcategories: ["Paint", "Electricals", "Repair Tools"]
    },
  ];

  const handleCategoryClick = (slug: string) => {
    if (onCategorySelect) {
      onCategorySelect(slug);
    }
    navigate(`/products?category=${slug}`);
  };

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700"
          >
            <div className="mb-3">
              {category.icon}
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
