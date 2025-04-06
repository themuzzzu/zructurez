
import { useNavigate } from "react-router-dom";
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
  Smartphone,
  Stethoscope,
  Truck
} from "lucide-react";

export const BusinessCategoryGrid = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      id: "retail-local-shops", 
      name: "Retail & Local Shops", 
      icon: <ShoppingBag className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["General Stores", "Specialty Shops", "Boutiques", "Supermarkets"],
      color: "from-blue-500 to-blue-600",
      imagePath: "/placeholders/image-1.jpg"
    },
    { 
      id: "electronics-mobile", 
      name: "Electronics & Mobile", 
      icon: <Smartphone className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Mobile Phones", "Computer Parts", "Gadget Stores", "Repair Services"],
      color: "from-purple-500 to-purple-600",
      imagePath: "/placeholders/image-2.jpg" 
    },
    { 
      id: "healthcare-medical", 
      name: "Healthcare & Medical", 
      icon: <Stethoscope className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Clinics", "Hospitals", "Pharmacies", "Medical Equipment"],
      color: "from-red-500 to-red-600",
      imagePath: "/placeholders/image-3.jpg" 
    },
    { 
      id: "food-beverage", 
      name: "Food & Beverage", 
      icon: <Utensils className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Restaurants", "Cafes", "Bakeries", "Food Delivery"],
      color: "from-pink-500 to-pink-600",
      imagePath: "/placeholders/image-4.jpg" 
    },
    { 
      id: "wholesale-distributors", 
      name: "Wholesale & Distributors", 
      icon: <Truck className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["FMCG Distributors", "Raw Materials", "Bulk Suppliers", "B2B Wholesalers"],
      color: "from-yellow-500 to-yellow-600",
      imagePath: "/placeholders/image-5.jpg" 
    },
    { 
      id: "home-living", 
      name: "Home & Living", 
      icon: <Home className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Furniture", "Interior Design", "Home Appliances", "Decor"],
      color: "from-green-500 to-green-600",
      imagePath: "/placeholders/image-6.jpg" 
    },
    { 
      id: "industrial-b2b", 
      name: "Industrial & B2B", 
      icon: <Briefcase className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Manufacturing", "Engineering Services", "Industrial Supplies", "Corporate Services"],
      color: "from-indigo-500 to-indigo-600",
      imagePath: "/placeholders/image-7.jpg" 
    },
    { 
      id: "auto-transport", 
      name: "Auto & Transport", 
      icon: <Car className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Car Dealerships", "Auto Parts", "Mechanics", "Transport Services"],
      color: "from-orange-500 to-orange-600",
      imagePath: "/placeholders/image-8.jpg" 
    },
    { 
      id: "real-estate", 
      name: "Real Estate", 
      icon: <Building className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Property Dealers", "Rental Services", "Construction", "Interior Design"],
      color: "from-cyan-500 to-cyan-600",
      imagePath: "/placeholders/image-9.jpg" 
    },
    { 
      id: "fashion-lifestyle", 
      name: "Fashion & Lifestyle", 
      icon: <Scissors className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Clothing Stores", "Accessories", "Beauty Salons", "Personal Care"],
      color: "from-teal-500 to-teal-600",
      imagePath: "/placeholders/image-10.jpg" 
    },
    { 
      id: "education-training", 
      name: "Education & Training", 
      icon: <GraduationCap className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Schools", "Colleges", "Coaching Centers", "Skill Development"],
      color: "from-rose-500 to-rose-600" 
    },
    { 
      id: "services", 
      name: "Professional Services", 
      icon: <Wrench className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Legal", "Financial", "IT Services", "Consulting"],
      color: "from-gray-500 to-gray-600" 
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
          >
            <div className={`p-3 text-white flex justify-center relative h-28`}>
              {category.imagePath ? (
                <img 
                  src={category.imagePath} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className={`absolute inset-0 w-full h-full bg-gradient-to-r ${category.color}`}></div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                {category.icon}
              </div>
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
