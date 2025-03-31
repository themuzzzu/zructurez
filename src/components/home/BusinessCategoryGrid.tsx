
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
  UserPlus,
  Phone
} from "lucide-react";

export const BusinessCategoryGrid = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      id: "home-services", 
      name: "Home Services", 
      icon: <Wrench className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Plumbers", "Electricians", "Cleaners", "Painters"],
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "education", 
      name: "Education", 
      icon: <GraduationCap className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Schools", "Colleges", "Coaching", "Online Courses"],
      color: "from-purple-500 to-purple-600" 
    },
    { 
      id: "health", 
      name: "Health & Fitness", 
      icon: <Heart className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Doctors", "Gyms", "Yoga Centers", "Dietitians"],
      color: "from-red-500 to-red-600" 
    },
    { 
      id: "beauty", 
      name: "Beauty & Grooming", 
      icon: <Scissors className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Salons", "Spas", "Makeup Artists", "Barbers"],
      color: "from-pink-500 to-pink-600" 
    },
    { 
      id: "rental", 
      name: "Rent & Hire", 
      icon: <Car className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Car Rentals", "Equipment", "Party Space", "Electronics"],
      color: "from-yellow-500 to-yellow-600" 
    },
    { 
      id: "b2b", 
      name: "B2B Services", 
      icon: <Briefcase className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Supply Chain", "Manufacturing", "Wholesale", "Consultancy"],
      color: "from-green-500 to-green-600" 
    },
    { 
      id: "events", 
      name: "Event Services", 
      icon: <PartyPopper className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Wedding", "Birthday", "Corporate", "Photography"],
      color: "from-indigo-500 to-indigo-600" 
    },
    { 
      id: "food", 
      name: "Food & Dining", 
      icon: <Utensils className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Restaurants", "Catering", "Cloud Kitchens", "Bakeries"],
      color: "from-orange-500 to-orange-600" 
    },
    { 
      id: "real-estate", 
      name: "Real Estate", 
      icon: <Home className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Buy", "Rent", "PG/Hostels", "Commercial"],
      color: "from-cyan-500 to-cyan-600" 
    },
    { 
      id: "hotels", 
      name: "Hotels & Travel", 
      icon: <Building className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Hotels", "Travel Agents", "Tour Packages", "Homestays"],
      color: "from-teal-500 to-teal-600" 
    },
    { 
      id: "shopping", 
      name: "Shopping", 
      icon: <ShoppingBag className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Electronics", "Fashion", "Groceries", "Home Decor"],
      color: "from-rose-500 to-rose-600" 
    },
    { 
      id: "services", 
      name: "Other Services", 
      icon: <Phone className="h-6 w-6 mb-2 stroke-black dark:stroke-white" />, 
      subcategories: ["Legal", "Financial", "IT Services", "Security"],
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
            <div className={`bg-gradient-to-r ${category.color} p-3 text-white flex justify-center`}>
              {category.icon}
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
