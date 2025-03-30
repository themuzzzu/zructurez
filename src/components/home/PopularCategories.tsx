
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export const PopularCategories = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  
  const popularCategories = [
    { id: "restaurants", name: "Restaurants", count: "2,450+", image: "/placeholder.svg" },
    { id: "doctors", name: "Doctors", count: "1,870+", image: "/placeholder.svg" },
    { id: "beauty-salons", name: "Beauty Salons", count: "1,350+", image: "/placeholder.svg" },
    { id: "home-services", name: "Home Services", count: "1,240+", image: "/placeholder.svg" },
    { id: "fitness", name: "Fitness", count: "980+", image: "/placeholder.svg" },
    { id: "education", name: "Education", count: "850+", image: "/placeholder.svg" },
    { id: "hotels", name: "Hotels", count: "730+", image: "/placeholder.svg" },
    { id: "real-estate", name: "Real Estate", count: "690+", image: "/placeholder.svg" }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
      
      setShowLeftScroll(current.scrollLeft > 0);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftScroll(scrollRef.current.scrollLeft > 0);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/businesses?category=${categoryId}`);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Popular Categories
        </h2>
        <button 
          onClick={() => navigate("/businesses")}
          className="text-primary hover:underline text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="relative">
        {showLeftScroll && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto space-x-4 py-2 scrollbar-none scroll-smooth"
        >
          {popularCategories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="flex-shrink-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-xs opacity-90">{category.count} listings</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};
