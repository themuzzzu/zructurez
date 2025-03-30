
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Award, Star, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FeaturedBusinesses = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  
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

  const handleBusinessClick = (businessId: string) => {
    navigate(`/businesses/${businessId}`);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Featured Businesses
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
          {featuredBusinesses.map((business) => (
            <div 
              key={business.id}
              onClick={() => handleBusinessClick(business.id)}
              className="flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={business.image} 
                  alt={business.name} 
                  className="w-full h-40 object-cover"
                />
                {business.isSponsored && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-yellow-500/80 text-white"
                  >
                    Sponsored
                  </Badge>
                )}
                {business.verified && (
                  <Badge 
                    variant="outline" 
                    className="absolute top-2 left-2 bg-blue-500/80 text-white flex items-center gap-1"
                  >
                    <Award className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{business.name}</h3>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs flex flex-col gap-1">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                    <span className="text-muted-foreground">{business.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <span className={`${business.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {business.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
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
