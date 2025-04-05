
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
  
  // Define categories with images, and slugs - updated without offers
  const categories = [
    { 
      name: "Fashion", 
      slug: "fashion", 
      image: "public/lovable-uploads/c216272c-6a1e-4146-a96a-70c7d0cb465e.png",
      emoji: "👗",
      subcategories: ["Men", "Women", "Kids", "Ethnic", "Western", "Lingerie"]
    },
    { 
      name: "Electronics", 
      slug: "electronics-gadgets", 
      image: "public/lovable-uploads/c320e3c9-e690-4ef0-8499-50f270bb7360.png",
      emoji: "📱",
      subcategories: ["Mobiles", "Laptops", "Smartwatches", "Accessories"]
    },
    { 
      name: "Home & Living", 
      slug: "home-living", 
      image: "public/lovable-uploads/5b566bc2-6fbf-419b-803e-67c9ba157492.png",
      emoji: "🏠",
      subcategories: ["Furniture", "Decor", "Kitchen", "Cleaning"]
    },
    { 
      name: "Beauty & Personal Care", 
      slug: "beauty-personal-care", 
      image: "public/lovable-uploads/60ecbe86-34fd-4945-b2c3-01a0c89380c6.png",
      emoji: "🛍️",
      subcategories: ["Skincare", "Makeup", "Grooming", "Perfumes"]
    },
    { 
      name: "Groceries", 
      slug: "groceries", 
      image: "public/lovable-uploads/b89dc2ea-392d-4b8b-88a2-afcd41c34f11.png",
      emoji: "🍅",
      subcategories: ["Fruits", "Veggies", "Snacks", "Dairy"]
    },
    { 
      name: "Health & Wellness", 
      slug: "health-wellness", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🧘",
      subcategories: ["Nutrition", "Gym gear", "Ayurvedic", "Mental wellness"]
    },
    { 
      name: "Toys & Kids", 
      slug: "toys-kids", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🧸",
      subcategories: ["Action figures", "Educational toys", "Puzzles", "Outdoor toys"]
    },
    { 
      name: "Sports & Outdoors", 
      slug: "sports-outdoors", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🏈",
      subcategories: ["Fitness", "Camping", "Team sports", "Water sports"]
    },
    { 
      name: "Automotive", 
      slug: "automotive-accessories", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🚗",
      subcategories: ["Car care", "Accessories", "Tools", "Parts"]
    },
    { 
      name: "Office Supplies", 
      slug: "office-stationery", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "📝",
      subcategories: ["Stationery", "Office furniture", "School supplies"]
    },
    { 
      name: "Tools & Equipment", 
      slug: "tools-industrial", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🛠️",
      subcategories: ["Hand tools", "Power tools", "Safety equipment"]
    },
    { 
      name: "Footwear", 
      slug: "footwear", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "👟",
      subcategories: ["Casual", "Formal", "Sports", "Designer"]
    },
    { 
      name: "Watches & Wearables", 
      slug: "watches-wearables", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "⌚",
      subcategories: ["Smartwatches", "Analog", "Digital", "Fitness bands"]
    },
    { 
      name: "Furniture & Decor", 
      slug: "furniture-decor", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🛋️",
      subcategories: ["Living room", "Bedroom", "Kitchen", "Office"]
    },
    { 
      name: "Music & Instruments", 
      slug: "music-instruments", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🎸",
      subcategories: ["String", "Percussion", "Wind", "Electronic"]
    },
    { 
      name: "Lifestyle", 
      slug: "lifestyle", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "🎁",
      subcategories: ["Gifts", "Stationery", "Pets", "Travel", "Hobby"]
    },
    { 
      name: "Books & Learning", 
      slug: "books-learning", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
      emoji: "📚",
      subcategories: ["Academic", "Novels", "Kids", "Competitive Prep"]
    },
    { 
      name: "Local Specials", 
      slug: "local-specials", 
      image: "public/lovable-uploads/10180ea0-a08a-4746-8f5c-6c126fdcbbb1.png",
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
        className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide"
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
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </section>
  );
};
