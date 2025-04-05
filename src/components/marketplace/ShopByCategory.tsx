
import { useNavigate } from "react-router-dom";
import { ImageFallback } from "@/components/ui/image-fallback";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";

interface CategoryProps {
  onCategorySelect?: (category: string) => void;
}

export const ShopByCategory = ({ onCategorySelect }: CategoryProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Define categories with images, offers, and slugs - updated with the requested categories
  const categories = [
    { 
      name: "Fashion", 
      slug: "fashion", 
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 70% Off",
      emoji: "👗",
      subcategories: ["Men", "Women", "Kids", "Ethnic", "Western", "Lingerie"]
    },
    { 
      name: "Electronics & Gadgets", 
      slug: "electronics-gadgets", 
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 40% Off",
      emoji: "📱",
      subcategories: ["Mobiles", "Laptops", "Smartwatches", "Accessories"]
    },
    { 
      name: "Home & Living", 
      slug: "home-living", 
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 60% Off",
      emoji: "🏠",
      subcategories: ["Furniture", "Decor", "Kitchen", "Cleaning"]
    },
    { 
      name: "Beauty & Personal Care", 
      slug: "beauty-personal-care", 
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 50% Off",
      emoji: "🛍️",
      subcategories: ["Skincare", "Makeup", "Grooming", "Perfumes"]
    },
    { 
      name: "Groceries", 
      slug: "groceries", 
      image: "public/lovable-uploads/43fa7ba2-a733-43ca-8075-fa539aed5c48.png", // Updated grocery image
      offer: "Up to 30% Off",
      emoji: "🍅",
      subcategories: ["Fruits", "Veggies", "Snacks", "Dairy"]
    },
    { 
      name: "Health & Wellness", 
      slug: "health-wellness", 
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Min 20% Off",
      emoji: "🧘",
      subcategories: ["Nutrition", "Gym gear", "Ayurvedic", "Mental wellness"]
    },
    { 
      name: "Lifestyle", 
      slug: "lifestyle", 
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "From ₹199",
      emoji: "🎁",
      subcategories: ["Gifts", "Stationery", "Pets", "Travel", "Hobby"]
    },
    { 
      name: "Books & Learning", 
      slug: "books-learning", 
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "From ₹99",
      emoji: "📚",
      subcategories: ["Academic", "Novels", "Kids", "Competitive Prep"]
    },
    { 
      name: "Sports & Fitness", 
      slug: "sports-fitness", 
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Extra 15% Off",
      emoji: "🏋️",
      subcategories: ["Fitness", "Yoga", "Sportswear"]
    },
    { 
      name: "Local Specials", 
      slug: "local-specials", 
      image: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Trending Now!",
      emoji: "🛒",
      subcategories: ["Regional", "Handmade", "Local Brands"]
    },
  ];

  const handleCategoryClick = (slug: string) => {
    if (onCategorySelect) {
      onCategorySelect(slug);
    }
    navigate(`/products?category=${slug}`);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = direction === "left" 
      ? -container.clientWidth / 2 
      : container.clientWidth / 2;
      
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shop by Category</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll("left")}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((category) => (
          <div
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="flex-shrink-0 w-24 sm:w-28 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 border border-gray-100 dark:border-gray-700 aspect-square">
              <ImageFallback
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                fallbackSrc="/placeholders/image-placeholder.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium truncate">{category.name}</p>
              <p className="text-xs text-muted-foreground">{category.offer}</p>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </section>
  );
};
