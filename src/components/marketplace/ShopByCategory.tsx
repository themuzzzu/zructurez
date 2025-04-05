
import { useNavigate } from "react-router-dom";
import { ImageFallback } from "@/components/ui/image-fallback";

interface CategoryProps {
  onCategorySelect?: (category: string) => void;
}

export const ShopByCategory = ({ onCategorySelect }: CategoryProps) => {
  const navigate = useNavigate();
  
  // Define categories with images, offers, and slugs
  const categories = [
    { 
      name: "Groceries", 
      slug: "groceries", 
      image: "public/lovable-uploads/307c184d-50f0-40b6-a36d-c70857c06009.png",
      offer: "Up to 50% Off",
      subcategories: ["Rice", "Oil", "Fruits", "Dairy"]
    },
    { 
      name: "Electronics", 
      slug: "electronics", 
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 40% Off",
      subcategories: ["Phones", "Laptops", "Audio", "Accessories"]
    },
    { 
      name: "Fashion", 
      slug: "fashion", 
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 80% Off",
      subcategories: ["Men", "Women", "Kids", "Ethnic"]
    },
    { 
      name: "Beauty", 
      slug: "beauty-personal-care", 
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 30% Off",
      subcategories: ["Makeup", "Haircare", "Skin"]
    },
    { 
      name: "Home & Living", 
      slug: "home-living", 
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 60% Off",
      subcategories: ["Decor", "Cookware", "Furniture", "Storage"]
    },
    { 
      name: "Health", 
      slug: "health-wellness", 
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Min 20% Off",
      subcategories: ["Medicines", "Ayurveda", "First Aid"]
    },
    { 
      name: "Books", 
      slug: "books-learning", 
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "From ₹99",
      subcategories: ["Academic", "Fiction", "Self-Help"]
    },
    { 
      name: "Sports", 
      slug: "sports-fitness", 
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Extra 15% Off",
      subcategories: ["Fitness", "Yoga", "Sportswear"]
    },
    { 
      name: "Local Specials", 
      slug: "local-specials", 
      image: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Trending Now!",
      subcategories: ["Regional", "Handmade", "Local Brands"]
    },
    { 
      name: "Tools", 
      slug: "tools-hardware", 
      image: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      offer: "Up to 25% Off",
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
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-700 h-[180px]"
          >
            <ImageFallback
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              fallbackSrc="/placeholders/image-placeholder.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white font-bold text-lg">{category.name}</h3>
              <span className="text-white/90 text-sm font-medium">{category.offer}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
