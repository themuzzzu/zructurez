
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const TrendingServices = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  
  const trendingServices = [
    { id: "wedding-photography", name: "Wedding Photography", searches: "1,200+", image: "/placeholder.svg" },
    { id: "house-cleaning", name: "House Cleaning", searches: "980+", image: "/placeholder.svg" },
    { id: "event-catering", name: "Event Catering", searches: "850+", image: "/placeholder.svg" },
    { id: "it-services", name: "IT Services", searches: "730+", image: "/placeholder.svg" },
    { id: "car-rental", name: "Car Rental", searches: "650+", image: "/placeholder.svg" },
    { id: "beauty-services", name: "Beauty Services", searches: "580+", image: "/placeholder.svg" },
    { id: "food-delivery", name: "Food Delivery", searches: "520+", image: "/placeholder.svg" },
    { id: "home-tutors", name: "Home Tutors", searches: "490+", image: "/placeholder.svg" }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/search?q=${serviceId}`);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Trending Services
        </h2>
        <button 
          onClick={() => navigate("/services")}
          className="text-primary hover:underline text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex space-x-3 py-2">
          {trendingServices.map((service) => (
            <div 
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="h-24 relative">
                <LazyImage 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm">{service.name}</h3>
                <p className="text-xs text-muted-foreground">{service.searches} searches</p>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
