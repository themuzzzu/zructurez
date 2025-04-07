
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
  ShoppingBag
} from "lucide-react";

export const BusinessCategoryGrid = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      id: "retail-local-shops", 
      name: "Retail & Local Shops", 
      icon: <Store className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Convenience Stores", "Gift Shops", "Stationery", "General Stores"],
      color: "from-blue-500 to-blue-600",
      image: "1.png"
    },
    { 
      id: "electronics-mobile", 
      name: "Electronics & Mobile", 
      icon: <Smartphone className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Phones", "Computers", "Accessories", "Repairs"],
      color: "from-purple-500 to-purple-600",
      image: "2.png"
    },
    { 
      id: "healthcare-medical", 
      name: "Healthcare & Medical", 
      icon: <Stethoscope className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Hospitals", "Clinics", "Pharmacies", "Diagnostics"],
      color: "from-red-500 to-red-600",
      image: "3.png"
    },
    { 
      id: "food-beverage", 
      name: "Food & Beverage", 
      icon: <Utensils className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Restaurants", "Cafes", "Bakeries", "Food Delivery"],
      color: "from-pink-500 to-pink-600",
      image: "4.png"
    },
    { 
      id: "wholesale-distributors", 
      name: "Wholesale & Distributors", 
      icon: <Package className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["FMCG", "Electronics", "Fashion", "Food & Beverage"],
      color: "from-yellow-500 to-yellow-600",
      image: "5.png"
    },
    { 
      id: "home-living", 
      name: "Home & Living", 
      icon: <Home className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Furniture", "Decor", "Kitchen", "Appliances"],
      color: "from-green-500 to-green-600",
      image: "6.png"
    },
    { 
      id: "industrial-b2b", 
      name: "Industrial & B2B", 
      icon: <Factory className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Manufacturing", "Construction", "Machinery", "Chemicals"],
      color: "from-indigo-500 to-indigo-600",
      image: "7.png"
    },
    { 
      id: "auto-transport", 
      name: "Auto & Transport", 
      icon: <Truck className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Cars", "Bikes", "Parts & Service", "Rentals"],
      color: "from-orange-500 to-orange-600",
      image: "8.png"
    },
    { 
      id: "real-estate", 
      name: "Real Estate", 
      icon: <Building className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Residential", "Commercial", "Plots", "PG/Hostel"],
      color: "from-cyan-500 to-cyan-600",
      image: "9.png"
    },
    { 
      id: "fashion-lifestyle", 
      name: "Fashion & Lifestyle", 
      icon: <ShoppingBag className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Clothing", "Footwear", "Accessories", "Cosmetics"],
      color: "from-teal-500 to-teal-600",
      image: "10.png"
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={`/images/categories/${category.image}`} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-center mb-2">{category.name}</h3>
              <div className="text-xs text-muted-foreground">
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
