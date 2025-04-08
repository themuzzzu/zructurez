
import { useNavigate } from "react-router-dom";
import { 
  Store, 
  Smartphone, 
  Stethoscope, 
  Utensils, 
  Package, 
  Home, 
  Factory, 
  Truck, 
  Building, 
  ShoppingBag,
  BookOpen
} from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";

export const BusinessCategoryGrid = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      id: "retail-local-shops", 
      name: "Retail & Local Shops", 
      icon: <Store className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Convenience Stores", "Gift Shops", "Stationery", "General Stores"],
      color: "from-blue-500 to-blue-600",
      image: "/lovable-uploads/190ab2dc-3b85-46f2-b3ad-6c9b98561d92.png"
    },
    { 
      id: "electronics-mobile", 
      name: "Electronics & Mobile", 
      icon: <Smartphone className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Phones", "Computers", "Accessories", "Repairs"],
      color: "from-purple-500 to-purple-600",
      image: "/lovable-uploads/77c3d77a-46df-4214-968b-9d2783cd1650.png"
    },
    { 
      id: "healthcare-medical", 
      name: "Healthcare & Medical", 
      icon: <Stethoscope className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Hospitals", "Clinics", "Pharmacies", "Diagnostics"],
      color: "from-red-500 to-red-600",
      image: "/lovable-uploads/c45ae2e8-68e5-4bc7-8f40-e38499c1964b.png"
    },
    { 
      id: "food-beverage", 
      name: "Food & Beverage", 
      icon: <Utensils className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Restaurants", "Cafes", "Bakeries", "Food Delivery"],
      color: "from-pink-500 to-pink-600",
      image: "/lovable-uploads/a55a0c88-8c54-4214-af9b-501db058737f.png"
    },
    { 
      id: "wholesale-distributors", 
      name: "Wholesale & Distributors", 
      icon: <Package className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["FMCG", "Electronics", "Fashion", "Food & Beverage"],
      color: "from-yellow-500 to-yellow-600",
      image: "/lovable-uploads/231c1ad6-3dfd-4f14-a708-a3460b9775c1.png"
    },
    { 
      id: "home-living", 
      name: "Home & Living", 
      icon: <Home className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Furniture", "Decor", "Kitchen", "Appliances"],
      color: "from-green-500 to-green-600",
      image: "/lovable-uploads/f84cb2fc-de67-4e88-a601-6751b32c8a01.png"
    },
    { 
      id: "industrial-b2b", 
      name: "Industrial & B2B", 
      icon: <Factory className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Manufacturing", "Construction", "Machinery", "Chemicals"],
      color: "from-indigo-500 to-indigo-600",
      image: "/images/categories/7.png"
    },
    { 
      id: "auto-transport", 
      name: "Auto & Transport", 
      icon: <Truck className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Cars", "Bikes", "Parts & Service", "Rentals"],
      color: "from-orange-500 to-orange-600",
      image: "/images/categories/8.png"
    },
    { 
      id: "real-estate", 
      name: "Real Estate", 
      icon: <Building className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Residential", "Commercial", "Plots", "PG/Hostel"],
      color: "from-cyan-500 to-cyan-600",
      image: "/lovable-uploads/8f516986-3dcb-4e92-a83e-12eda46b3aca.png"
    },
    { 
      id: "fashion-lifestyle", 
      name: "Fashion & Lifestyle", 
      icon: <ShoppingBag className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Clothing", "Footwear", "Accessories", "Cosmetics"],
      color: "from-teal-500 to-teal-600",
      image: "/lovable-uploads/67df8df3-8c7e-4dc3-98e9-9ffddf31e4d9.png"
    },
    { 
      id: "books-education", 
      name: "Books & Education", 
      icon: <BookOpen className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Academic Books", "Fiction", "Stationery", "Educational Tools"],
      color: "from-amber-500 to-amber-600",
      image: "/lovable-uploads/c6e9ffef-faa6-429d-812c-338d60300316.png"
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/businesses?category=${categoryId}`);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Browse Business Categories</h2>
        <button 
          onClick={() => navigate("/businesses")}
          className="text-primary hover:underline text-sm font-medium flex items-center"
        >
          View All Categories
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden h-full"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <LazyImage 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover"
                width={300}
                height={200}
              />
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-center mb-2 line-clamp-1">{category.name}</h3>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {category.subcategories.slice(0, 2).join(", ")}
                {category.subcategories.length > 2 && "..."}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
