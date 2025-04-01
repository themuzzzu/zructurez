
import { useNavigate } from "react-router-dom";
import { 
  Wrench, 
  Zap, 
  Computer, 
  Scissors, 
  Home, 
  Truck, 
  PaintBucket,
  Camera,
  Heart,
  Dog,
  BookOpen,
  Wifi,
  Car,
  UtensilsCrossed,
  Baby,
  Music2,
  Dumbbell,
  Stethoscope
} from "lucide-react";

interface ServiceIconGridProps {
  onCategorySelect?: (category: string) => void;
}

export const ServiceIconGrid = ({ onCategorySelect }: ServiceIconGridProps) => {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Plumbing", icon: Wrench, id: "plumbing" },
    { name: "Electrical", icon: Zap, id: "electrical" },
    { name: "Computer Repair", icon: Computer, id: "computer-repair" },
    { name: "Beauty", icon: Scissors, id: "beauty" },
    { name: "Home Cleaning", icon: Home, id: "cleaning" },
    { name: "Moving", icon: Truck, id: "moving" },
    { name: "Painting", icon: PaintBucket, id: "painting" },
    { name: "Photography", icon: Camera, id: "photography" },
    { name: "Wellness", icon: Heart, id: "wellness" },
    { name: "Pet Care", icon: Dog, id: "pet-care" },
    { name: "Tutoring", icon: BookOpen, id: "tutoring" },
    { name: "Internet", icon: Wifi, id: "internet" },
    { name: "Automotive", icon: Car, id: "automotive" },
    { name: "Catering", icon: UtensilsCrossed, id: "catering" },
    { name: "Childcare", icon: Baby, id: "childcare" },
    { name: "Music Lessons", icon: Music2, id: "music" },
    { name: "Fitness", icon: Dumbbell, id: "fitness" },
    { name: "Healthcare", icon: Stethoscope, id: "healthcare" }
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
    
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };
  
  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-4 px-3 sm:px-4 md:px-6">
      <h2 className="text-xl font-bold mb-4 text-white">Service Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div 
              key={category.id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-900/30 mb-2 transition-transform group-hover:scale-110">
                <Icon size={20} className="text-blue-400" />
              </div>
              <span className="text-xs text-center text-white line-clamp-1">{category.name}</span>
            </div>
          )}
        )}
      </div>
    </div>
  );
};
