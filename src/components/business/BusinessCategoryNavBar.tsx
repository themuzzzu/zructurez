
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubCategory {
  id: string;
  name: string;
}

interface BusinessCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  subCategories?: SubCategory[];
}

import { 
  Wrench, 
  GraduationCap, 
  Heart, 
  Scissors, 
  Car, 
  Briefcase, 
  PartyPopper, 
  Utensils, 
  Home, 
  Building, 
  ShoppingBag,
  UserPlus,
  Phone
} from "lucide-react";

export const BusinessCategoryNavBar = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: BusinessCategory[] = [
    { 
      id: "home-services", 
      name: "Home Services", 
      icon: Wrench,
      subCategories: [
        { id: "plumbers", name: "Plumbers" },
        { id: "electricians", name: "Electricians" },
        { id: "cleaners", name: "Cleaners" },
        { id: "painters", name: "Painters" }
      ]
    },
    { 
      id: "education", 
      name: "Education", 
      icon: GraduationCap,
      subCategories: [
        { id: "schools", name: "Schools" },
        { id: "colleges", name: "Colleges" },
        { id: "coaching", name: "Coaching" },
        { id: "online-courses", name: "Online Courses" }
      ]
    },
    { 
      id: "health", 
      name: "Health & Fitness", 
      icon: Heart,
      subCategories: [
        { id: "doctors", name: "Doctors" },
        { id: "gyms", name: "Gyms" },
        { id: "yoga-centers", name: "Yoga Centers" },
        { id: "dietitians", name: "Dietitians" }
      ]
    },
    { 
      id: "beauty", 
      name: "Beauty & Grooming", 
      icon: Scissors,
      subCategories: [
        { id: "salons", name: "Salons" },
        { id: "spas", name: "Spas" },
        { id: "makeup-artists", name: "Makeup Artists" },
        { id: "barbers", name: "Barbers" }
      ]
    },
    { 
      id: "rental", 
      name: "Rent & Hire", 
      icon: Car,
      subCategories: [
        { id: "car-rentals", name: "Car Rentals" },
        { id: "equipment", name: "Equipment" },
        { id: "party-space", name: "Party Space" },
        { id: "electronics", name: "Electronics" }
      ]
    },
    { 
      id: "b2b", 
      name: "B2B Services", 
      icon: Briefcase,
      subCategories: [
        { id: "supply-chain", name: "Supply Chain" },
        { id: "manufacturing", name: "Manufacturing" },
        { id: "wholesale", name: "Wholesale" },
        { id: "consultancy", name: "Consultancy" }
      ]
    },
    { 
      id: "events", 
      name: "Event Services", 
      icon: PartyPopper,
      subCategories: [
        { id: "wedding", name: "Wedding" },
        { id: "birthday", name: "Birthday" },
        { id: "corporate", name: "Corporate" },
        { id: "photography", name: "Photography" }
      ]
    },
    { 
      id: "food", 
      name: "Food & Dining", 
      icon: Utensils,
      subCategories: [
        { id: "restaurants", name: "Restaurants" },
        { id: "catering", name: "Catering" },
        { id: "cloud-kitchens", name: "Cloud Kitchens" },
        { id: "bakeries", name: "Bakeries" }
      ]
    },
    { 
      id: "real-estate", 
      name: "Real Estate", 
      icon: Home,
      subCategories: [
        { id: "buy", name: "Buy" },
        { id: "rent", name: "Rent" },
        { id: "pg-hostels", name: "PG/Hostels" },
        { id: "commercial", name: "Commercial" }
      ]
    },
    { 
      id: "hotels", 
      name: "Hotels & Travel", 
      icon: Building,
      subCategories: [
        { id: "hotels", name: "Hotels" },
        { id: "travel-agents", name: "Travel Agents" },
        { id: "tour-packages", name: "Tour Packages" },
        { id: "homestays", name: "Homestays" }
      ]
    },
    { 
      id: "shopping", 
      name: "Shopping", 
      icon: ShoppingBag,
      subCategories: [
        { id: "electronics", name: "Electronics" },
        { id: "fashion", name: "Fashion" },
        { id: "groceries", name: "Groceries" },
        { id: "home-decor", name: "Home Decor" }
      ]
    },
    { 
      id: "services", 
      name: "Other Services", 
      icon: Phone,
      subCategories: [
        { id: "legal", name: "Legal" },
        { id: "financial", name: "Financial" },
        { id: "it-services", name: "IT Services" },
        { id: "security", name: "Security" }
      ]
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
    // Toggle active category
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    navigate(`/businesses?category=${categoryId}&subcategory=${subCategoryId}`);
    setActiveCategory(null);
  };

  // Navigate to category page when clicking "View all" button
  const handleViewAllClick = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/businesses?category=${categoryId}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm rounded-lg mb-6">
      <div className="container max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide py-2">
          {categories.map((category) => (
            <div key={category.id} className="relative flex-shrink-0">
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-2 min-w-[90px] text-center whitespace-nowrap",
                  activeCategory === category.id ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <category.icon className="w-7 h-7 mb-1" />
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

              {/* Improved dropdown menu with better visibility and interaction */}
              {category.subCategories && activeCategory === category.id && (
                <div 
                  ref={dropdownRef} 
                  className="absolute z-50 left-0 mt-1 bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 rounded-md min-w-[250px] max-h-[400px] overflow-y-auto"
                >
                  <div className="py-2">
                    <div className="sticky top-0 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 p-2 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <button 
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => handleViewAllClick(category.id, e)}
                      >
                        View all
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                      {category.subCategories.map((subCategory) => (
                        <button
                          key={subCategory.id}
                          className="text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm rounded-md"
                          onClick={() => handleSubCategoryClick(category.id, subCategory.id)}
                        >
                          {subCategory.name}
                        </button>
                      ))}
                    </div>
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
