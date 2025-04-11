import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Award, Star, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FeaturedBusinesses = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  const featuredBusinesses = [
    { 
      id: "1", 
      name: "Elite Tech Solutions", 
      category: "IT Services", 
      rating: 4.8, 
      reviews: 125, 
      location: "Koramangala, Bangalore", 
      image: "/placeholder.svg",
      verified: true,
      isSponsored: true,
      isOpen: true
    },
    { 
      id: "2", 
      name: "Lotus Spa & Salon", 
      category: "Beauty & Spa", 
      rating: 4.6, 
      reviews: 89, 
      location: "HSR Layout, Bangalore", 
      image: "/placeholder.svg",
      verified: true,
      isSponsored: true,
      isOpen: true
    },
    { 
      id: "3", 
      name: "Supreme Home Services", 
      category: "Home Cleaning", 
      rating: 4.5, 
      reviews: 76, 
      location: "Indiranagar, Bangalore", 
      image: "/placeholder.svg",
      verified: true,
      isSponsored: false,
      isOpen: true
    },
    { 
      id: "4", 
      name: "Global Education Center", 
      category: "Education", 
      rating: 4.7, 
      reviews: 105, 
      location: "Whitefield, Bangalore", 
      image: "/placeholder.svg",
      verified: false,
      isSponsored: false,
      isOpen: false
    },
    { 
      id: "5", 
      name: "Car Care Express", 
      category: "Automotive", 
      rating: 4.4, 
      reviews: 67, 
      location: "JP Nagar, Bangalore", 
      image: "/placeholder.svg",
      verified: true,
      isSponsored: true,
      isOpen: true
    }
  ];

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      // Check after images might have loaded
      window.addEventListener('load', checkScrollPosition);
      
      return () => {
        scrollEl.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('load', checkScrollPosition);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth / 2;
      
      if (direction === 'left') {
        current.scrollTo({
          left: current.scrollLeft - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        current.scrollTo({
          left: current.scrollLeft + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleBusinessClick = (businessId: string) => {
    navigate(`/businesses/${businessId}`);
  };

  return (
    <section className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center">
          <Award className="h-5 w-5 mr-2 text-zinc-700 dark:text-zinc-300" />
          Featured Businesses
        </h2>
        <button 
          onClick={() => navigate("/businesses")}
          className="text-zinc-700 dark:text-zinc-300 hover:underline text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="relative">
        {showLeftScroll && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-zinc-800 rounded-full shadow-md p-2 border border-zinc-200 dark:border-zinc-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 py-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: 0, paddingRight: 0 }}
        >
          {featuredBusinesses.map((business) => (
            <div 
              key={business.id}
              onClick={() => handleBusinessClick(business.id)}
              className="flex-shrink-0 w-[85%] sm:w-[250px] snap-start bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-zinc-200 dark:border-zinc-700"
            >
              <div className="relative">
                <img 
                  src={business.image} 
                  alt={business.name} 
                  className="w-full h-32 sm:h-40 object-cover"
                  loading="lazy"
                />
                {business.isSponsored && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800"
                  >
                    Sponsored
                  </Badge>
                )}
                {business.verified && (
                  <Badge 
                    variant="outline" 
                    className="absolute top-2 left-2 bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-white flex items-center gap-1 border-zinc-300 dark:border-zinc-600"
                  >
                    <Award className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm sm:text-base line-clamp-1">{business.name}</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">{business.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs flex flex-col gap-1">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-zinc-500 flex-shrink-0" />
                    <span className="text-zinc-500 dark:text-zinc-400 truncate text-xs">{business.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-zinc-500 flex-shrink-0" />
                    <span className={`text-xs ${business.isOpen ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {business.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {showRightScroll && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-zinc-800 rounded-full shadow-md p-2 border border-zinc-200 dark:border-zinc-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
