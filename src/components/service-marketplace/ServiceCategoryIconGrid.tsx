
import { useNavigate } from 'react-router-dom';

// Define service category icons and colors
const serviceCategories = [
  { id: 'home', name: 'Home', icon: '🏠', color: 'bg-blue-100 text-blue-600' },
  { id: 'beauty', name: 'Beauty', icon: '💇', color: 'bg-pink-100 text-pink-600' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: 'bg-green-100 text-green-600' },
  { id: 'professional', name: 'Professional', icon: '👔', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'technology', name: 'Technology', icon: '💻', color: 'bg-purple-100 text-purple-600' },
  { id: 'education', name: 'Education', icon: '📚', color: 'bg-amber-100 text-amber-600' },
  { id: 'events', name: 'Events', icon: '🎉', color: 'bg-red-100 text-red-600' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', color: 'bg-slate-100 text-slate-600' }
];

interface ServiceCategoryIconGridProps {
  onCategorySelect: (category: string) => void;
}

export function ServiceCategoryIconGrid({ onCategorySelect }: ServiceCategoryIconGridProps) {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
      {serviceCategories.map((category) => (
        <button
          key={category.id}
          className="flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:-translate-y-1 hover:shadow-md"
          onClick={() => handleCategoryClick(category.id)}
        >
          <div className={`w-12 h-12 flex items-center justify-center rounded-full ${category.color} text-xl mb-2`}>
            {category.icon}
          </div>
          <span className="text-sm font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
