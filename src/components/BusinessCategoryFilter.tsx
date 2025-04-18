
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Hospital, 
  Car, 
  UtensilsCrossed,
  Briefcase,
  Scissors,
  GraduationCap,
  Building2,
  ShoppingBag,
  Dumbbell,
  Home,
  Wrench,
  Heart
} from "lucide-react";

const categories = [
  { id: "all", name: "All", icon: null },
  { id: "healthcare", name: "Healthcare", icon: Hospital },
  { id: "driving-school", name: "Driving Schools", icon: Car },
  { id: "restaurant", name: "Restaurants", icon: UtensilsCrossed },
  { id: "professional", name: "Professional Services", icon: Briefcase },
  { id: "salon", name: "Beauty & Salon", icon: Scissors },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "real-estate", name: "Real Estate", icon: Building2 },
  { id: "retail", name: "Retail", icon: ShoppingBag },
  { id: "fitness", name: "Fitness", icon: Dumbbell },
  { id: "home-services", name: "Home Services", icon: Home },
  { id: "maintenance", name: "Maintenance", icon: Wrench },
  { id: "wellness", name: "Wellness", icon: Heart },
];

interface BusinessCategoryFilterProps {
  onCategoryChange?: (category: string) => void;
}

export const BusinessCategoryFilter = ({ onCategoryChange }: BusinessCategoryFilterProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract category from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      if (onCategoryChange) {
        onCategoryChange(categoryParam);
      }
    }
  }, [location.search, onCategoryChange]);

  useEffect(() => {
    // Scroll selected category into view
    if (selectedCategory && scrollRef.current) {
      const selectedElement = document.getElementById(`category-${selectedCategory}`);
      if (selectedElement) {
        const scrollContainer = scrollRef.current;
        const scrollLeft = selectedElement.offsetLeft - (scrollContainer.offsetWidth / 2) + (selectedElement.offsetWidth / 2);
        scrollContainer.scrollLeft = Math.max(0, scrollLeft);
      }
    }
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Update URL with selected category
    const currentPath = location.pathname;
    if (categoryId === "all") {
      navigate(currentPath);
    } else {
      navigate(`${currentPath}?category=${categoryId}`);
    }
    
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
    toast.success(`Filtered by ${categories.find(c => c.id === categoryId)?.name}`);
  };

  return (
    <div className="w-full overflow-hidden animate-fade-up px-1 sm:px-2">
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto scrollbar-hide pb-3 flex"
      >
        <div className="flex gap-2 sm:gap-3 min-w-max px-1">
          {categories.map(({ id, name, icon: Icon }) => (
            <Button
              id={`category-${id}`}
              key={id}
              variant={id === selectedCategory ? "default" : "outline"}
              className="whitespace-nowrap min-w-[100px] sm:min-w-[120px] justify-center transition-colors duration-300 hover:bg-accent/80"
              onClick={() => handleCategoryClick(id)}
            >
              {Icon && <Icon className="h-4 w-4 mr-2 shrink-0 stroke-black dark:stroke-white" />}
              <span className="truncate text-sm">{name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
