
import { useNavigate } from "react-router-dom";
import { ImageFallback } from "@/components/ui/image-fallback";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface CategoryProps {
  onCategorySelect?: (category: string) => void;
}

export const ShopByCategory = ({ onCategorySelect }: CategoryProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Check scroll position on mount and scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const checkScroll = () => {
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
    };
    
    // Initial check
    checkScroll();
    
    // Add scroll listener
    container.addEventListener('scroll', checkScroll);
    
    // Clean up
    return () => container.removeEventListener('scroll', checkScroll);
  }, []);
  
  // Define categories with images, slugs, and subcategories
  const categories = [
    { 
      name: "Books & Stationery", 
      slug: "books-learning", 
      image: "/lovable-uploads/902e00b8-b9ee-4d85-9900-5a9dc71454fd.png",
      emoji: "📚",
      subcategories: ["Academic", "Novels", "Kids", "Competitive Prep"]
    },
    { 
      name: "Groceries", 
      slug: "groceries", 
      image: "/lovable-uploads/5942c156-f468-4ea2-a34f-796b645655ca.png",
      emoji: "🍅",
      subcategories: ["Fruits", "Veggies", "Snacks", "Dairy"]
    },
    { 
      name: "Footwear", 
      slug: "footwear", 
      image: "/lovable-uploads/8e125da5-7595-4194-9371-74a18d030bfb.png",
      emoji: "👟",
      subcategories: ["Casual", "Formal", "Sports", "Designer"]
    },
    { 
      name: "Furniture & Decor", 
      slug: "furniture-decor", 
      image: "/lovable-uploads/46a5e835-fcad-4044-8ca3-a3b617d56afd.png",
      emoji: "🛋️",
      subcategories: ["Living room", "Bedroom", "Kitchen", "Office"]
    },
    { 
      name: "Tools & Equipment", 
      slug: "tools-industrial", 
      image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png",
      emoji: "🛠️",
      subcategories: ["Hand tools", "Power tools", "Safety equipment"]
    },
    { 
      name: "Office Supplies", 
      slug: "office-stationery", 
      image: "/lovable-uploads/a7740c92-7834-44b7-8792-8219a626c89e.png",
      emoji: "📝",
      subcategories: ["Stationery", "Office furniture", "School supplies"]
    },
    { 
      name: "Music & Instruments", 
      slug: "music-instruments", 
      image: "/lovable-uploads/b115af2e-9af1-4687-aa29-54fecdc0a407.png",
      emoji: "🎸",
      subcategories: ["String", "Percussion", "Wind", "Electronic"]
    },
    { 
      name: "Gadgets", 
      slug: "gadgets", 
      image: "/lovable-uploads/acd9eefd-af02-4802-bf55-d763394f5405.png",
      emoji: "📱",
      subcategories: ["Smartwatches", "Earbuds", "Drones", "Smart Home"]
    },
    { 
      name: "Fashion", 
      slug: "fashion", 
      image: "/lovable-uploads/419c291d-6963-4a4b-b1b0-4b622135325e.png",
      emoji: "👗",
      subcategories: ["Men", "Women", "Kids", "Ethnic", "Western"]
    },
    { 
      name: "Electronics", 
      slug: "electronics-gadgets", 
      image: "/lovable-uploads/e7c73401-c132-4b6c-abe0-2d49a225f83d.png",
      emoji: "📱",
      subcategories: ["Mobiles", "Laptops", "Smartwatches"]
    },
    { 
      name: "Home & Living", 
      slug: "home-living", 
      image: "/lovable-uploads/65def346-4fbc-4608-96b6-c4c84d95674a.png",
      emoji: "🏠",
      subcategories: ["Furniture", "Decor", "Kitchen"]
    },
    { 
      name: "Beauty & Personal Care", 
      slug: "beauty-personal-care", 
      image: "/lovable-uploads/2e9af2d1-315c-4db1-8b84-8f97e84ca787.png",
      emoji: "🛍️",
      subcategories: ["Skincare", "Makeup", "Grooming"]
    },
    { 
      name: "Health & Wellness", 
      slug: "health-wellness", 
      image: "/lovable-uploads/19edca98-103a-449f-a5ea-5145cf7426bb.png",
      emoji: "🧘",
      subcategories: ["Nutrition", "Gym gear", "Ayurvedic"]
    },
    { 
      name: "Toys & Kids", 
      slug: "toys-kids", 
      image: "/lovable-uploads/de89c019-62c3-40c7-b29b-3157b73d17a1.png",
      emoji: "🧸",
      subcategories: ["Action figures", "Educational toys", "Puzzles"]
    },
    { 
      name: "Sports & Outdoors", 
      slug: "sports-outdoors", 
      image: "/lovable-uploads/402efee3-58a7-40fc-b8c9-8232c9a4ae6d.png",
      emoji: "🏈",
      subcategories: ["Fitness", "Camping", "Team sports"]
    },
    { 
      name: "Automotive", 
      slug: "automotive-accessories", 
      image: "/lovable-uploads/43fa7ba2-a733-43ca-8075-fa539aed5c48.png",
      emoji: "🚗",
      subcategories: ["Car care", "Accessories", "Tools"]
    },
    { 
      name: "Gifts", 
      slug: "gifts", 
      image: "/lovable-uploads/419c291d-6963-4a4b-b1b0-4b622135325e.png",
      emoji: "🎁",
      subcategories: ["Birthday", "Anniversary", "Wedding"]
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
          {showLeftArrow && (
            <button 
              onClick={() => scroll("left")}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRightArrow && (
            <button 
              onClick={() => scroll("right")}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
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
                lazyLoad={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs sm:text-sm font-medium truncate">{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
