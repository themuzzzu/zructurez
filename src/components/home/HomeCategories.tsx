
import { useNavigate } from "react-router-dom";
import { 
  Store, 
  Smartphone, 
  Stethoscope, 
  ShoppingBag, 
  Package, 
  Home as HomeIcon,
  Building2,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const categories = [
  {
    id: "retail",
    name: "Retail & Shopping",
    icon: <Store className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
    href: "/marketplace?category=retail"
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: <Smartphone className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
    href: "/marketplace?category=electronics"
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <Stethoscope className="h-6 w-6" />,
    color: "from-pink-500 to-pink-600",
    href: "/services?category=healthcare"
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: <ShoppingBag className="h-6 w-6" />,
    color: "from-rose-500 to-rose-600",
    href: "/marketplace?category=fashion"
  },
  {
    id: "wholesale",
    name: "Wholesale",
    icon: <Package className="h-6 w-6" />,
    color: "from-amber-500 to-amber-600",
    href: "/business?category=wholesale"
  },
  {
    id: "home-living",
    name: "Home & Living",
    icon: <HomeIcon className="h-6 w-6" />,
    color: "from-green-500 to-green-600",
    href: "/marketplace?category=home"
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: <Building2 className="h-6 w-6" />,
    color: "from-cyan-500 to-cyan-600",
    href: "/business?category=real-estate"
  },
  {
    id: "education",
    name: "Education",
    icon: <GraduationCap className="h-6 w-6" />,
    color: "from-indigo-500 to-indigo-600",
    href: "/services?category=education"
  }
];

export function HomeCategories() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => navigate(category.href)}
          className="cursor-pointer group"
        >
          <div className={cn(
            "relative h-32 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]",
            "bg-gradient-to-br",
            category.color
          )}>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
            <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
              <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
                {category.icon}
              </div>
              <h3 className="text-sm font-medium text-center">
                {category.name}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
