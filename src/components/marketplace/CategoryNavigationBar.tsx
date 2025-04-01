
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryDropdownMenu } from "./CategoryDropdownMenu";

interface SubCategory {
  id: string;
  name: string;
  subSubCategories?: {
    id: string;
    name: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories?: SubCategory[];
}

export const CategoryNavigationBar = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    {
      id: "kilos",
      name: "Kilos",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
    },
    {
      id: "mobiles",
      name: "Mobiles",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
      subCategories: [
        { 
          id: "mens-top-wear", 
          name: "Men's Top Wear",
          subSubCategories: [
            { id: "mens-tshirts", name: "Men's T-Shirts" },
            { id: "mens-casual-shirts", name: "Men's Casual Shirts" },
            { id: "mens-formal-shirts", name: "Men's Formal Shirts" },
            { id: "mens-kurtas", name: "Men's Kurtas" },
            { id: "mens-ethnic-sets", name: "Men's Ethnic Sets" },
            { id: "mens-blazers", name: "Men's Blazers" },
            { id: "mens-raincoat", name: "Men's Raincoat" },
            { id: "mens-windcheaters", name: "Men's Windcheaters" },
            { id: "mens-suit", name: "Men's Suit" },
            { id: "mens-fabrics", name: "Men's Fabrics" },
          ]
        },
        { id: "mens-bottom-wear", name: "Men's Bottom Wear" },
        { id: "women-ethnic", name: "Women Ethnic" },
        { id: "men-footwear", name: "Men Footwear" },
        { id: "women-footwear", name: "Women Footwear" },
        { id: "watches-accessories", name: "Watches and Accessories" },
        { id: "women-western", name: "Women Western" },
        { id: "bags-luggage", name: "Bags, Suitcases & Luggage" },
        { id: "kids", name: "Kids" },
        { id: "essentials", name: "Essentials" },
        { id: "winter", name: "Winter" },
      ]
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
      subCategories: [
        { id: "audio", name: "Audio" },
        { id: "electronics-gst-store", name: "Electronics GST Store" },
        { id: "cameras-accessories", name: "Cameras & Accessories" },
        { id: "computer-peripherals", name: "Computer Peripherals" },
        { id: "gaming", name: "Gaming" },
        { id: "health-personal-care", name: "Health & Personal Care" },
        { id: "laptop-accessories", name: "Laptop Accessories" },
        { id: "laptop-desktop", name: "Laptop and Desktop" },
        { id: "mobile-accessory", name: "Mobile Accessory" },
        { id: "powerbank", name: "Powerbank" },
        { id: "smart-home", name: "Smart Home automation" },
        { id: "smart-wearables", name: "Smart Wearables" },
        { id: "storage", name: "Storage" },
        { id: "tablets", name: "Tablets" },
      ]
    },
    {
      id: "home-furniture",
      name: "Home & Furniture",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
      subCategories: [
        { id: "home-furnishings", name: "Home Furnishings" },
        { id: "furniture", name: "Furniture" },
        { id: "living-room", name: "Living Room Furniture" },
        { id: "kitchen-dining", name: "Kitchen & Dining" },
        { id: "bedroom-furniture", name: "Bedroom Furniture" },
        { id: "space-saving", name: "Space Saving Furniture" },
        { id: "home-decor", name: "Home Decor" },
        { id: "tools-utility", name: "Tools & Utility" },
        { id: "workspace-furniture", name: "Work Space Furniture" },
        { id: "kids-furniture", name: "Kids Furniture" },
        { id: "lighting", name: "Lightings & Electricals" },
        { id: "cleaning-bath", name: "Cleaning & Bath" },
        { id: "pet-gardening", name: "Pet & Gardening" },
      ]
    },
    {
      id: "appliances",
      name: "Appliances",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
    },
    {
      id: "flight-bookings",
      name: "Flight Bookings",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
    },
    {
      id: "beauty-toys-more",
      name: "Beauty, Toys & More",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
      subCategories: [
        { id: "beauty-personal-care", name: "Beauty & Personal Care" },
        { id: "mens-grooming", name: "Men's Grooming" },
        { id: "food-drinks", name: "Food & Drinks" },
        { id: "nutrition-health", name: "Nutrition & Health Care" },
        { id: "baby-care", name: "Baby Care" },
        { id: "toys-school", name: "Toys & School Supplies" },
        { id: "sports-fitness", name: "Sports & Fitness" },
        { id: "books", name: "Books" },
        { id: "music", name: "Music" },
        { id: "stationery", name: "Stationery & Office Supplies" },
        { id: "auto-accessories", name: "Auto Accessories" },
        { id: "safety-hygiene", name: "Safety & Hygiene Essentials" },
      ]
    },
    {
      id: "two-wheelers",
      name: "Two Wheelers",
      icon: "/lovable-uploads/c86169c0-2979-42b7-8182-313a645ea572.png",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }

    // Navigate to category page when clicking on a category
    navigate(`/marketplace?category=${categoryId}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="container max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <div key={category.id} className="relative flex-shrink-0">
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-2 min-w-[85px] text-center whitespace-nowrap",
                  activeCategory === category.id ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="w-14 h-14 mb-1 object-contain" // Increased from w-12 h-12 to w-14 h-14
                />
                <span className="text-xs font-medium flex items-center">
                  {category.name}
                  {category.subCategories && (
                    <ChevronDown 
                      className={cn(
                        "ml-1 h-3 w-3 transition-transform", 
                        activeCategory === category.id ? "transform rotate-180" : ""
                      )} 
                    />
                  )}
                </span>
              </button>

              {/* Display Dropdown Menu if category has subcategories */}
              {category.subCategories && activeCategory === category.id && (
                <div ref={dropdownRef} className="absolute z-50 left-0 mt-1 bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-md min-w-[250px]">
                  <div className="py-2">
                    {category.subCategories.map((subCategory) => (
                      <CategoryDropdownMenu 
                        key={subCategory.id}
                        categoryId={category.id}
                        categoryName={category.name}
                        subCategories={[subCategory]}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
