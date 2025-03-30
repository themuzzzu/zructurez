
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const DealsSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  
  const deals = [
    { 
      id: "1", 
      title: "50% OFF First-Time AC Service", 
      business: "CoolAir Services", 
      validUntil: "2023-08-31", 
      discount: "50%",
      image: "/placeholder.svg",
      color: "bg-blue-500"
    },
    { 
      id: "2", 
      title: "Buy 1 Get 1 Free on Beauty Services", 
      business: "Glamour Salon", 
      validUntil: "2023-08-15", 
      discount: "BOGO",
      image: "/placeholder.svg",
      color: "bg-pink-500"
    },
    { 
      id: "3", 
      title: "30% OFF Weekend Car Wash", 
      business: "SparkleWash", 
      validUntil: "2023-09-30", 
      discount: "30%",
      image: "/placeholder.svg",
      color: "bg-green-500"
    },
    { 
      id: "4", 
      title: "20% OFF Home Cleaning Services", 
      business: "CleanHome Pro", 
      validUntil: "2023-08-25", 
      discount: "20%",
      image: "/placeholder.svg",
      color: "bg-yellow-500"
    },
    { 
      id: "5", 
      title: "Flat ₹500 OFF on First Consultation", 
      business: "Dr. Health Clinic", 
      validUntil: "2023-09-15", 
      discount: "₹500",
      image: "/placeholder.svg",
      color: "bg-purple-500"
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

  const handleDealClick = (dealId: string) => {
    navigate(`/deals/${dealId}`);
  };

  // Calculate days remaining
  const getDaysRemaining = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Tag className="h-5 w-5 mr-2 text-red-500" />
          Hot Deals & Offers
        </h2>
        <button 
          onClick={() => navigate("/deals")}
          className="text-primary hover:underline text-sm font-medium"
        >
          View All Deals
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
          {deals.map((deal) => (
            <div 
              key={deal.id}
              onClick={() => handleDealClick(deal.id)}
              className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                <Badge 
                  className={`absolute top-3 left-3 ${deal.color} text-white text-xs px-2 py-1`}
                >
                  {deal.discount} OFF
                </Badge>
              </div>
              <div className="p-3">
                <h3 className="font-medium line-clamp-1">{deal.title}</h3>
                <p className="text-sm text-muted-foreground">{deal.business}</p>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {getDaysRemaining(deal.validUntil)} days left
                    </span>
                  </div>
                  <button className="text-xs bg-primary text-white px-2 py-1 rounded">
                    Grab Deal
                  </button>
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
