
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const MarketplaceBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: banners = [] } = useQuery({
    queryKey: ['marketplace-banners'],
    queryFn: async () => {
      // Example banners - in a real app, these would come from the database
      // You can replace this with actual data from Supabase
      return [
        {
          id: 1,
          image_url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
          title: "Summer Sale",
          subtitle: "Up to 50% off on all products",
          action_url: "/marketplace?category=summer-sale"
        },
        {
          id: 2,
          image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
          title: "New Arrivals",
          subtitle: "Check out our latest collection",
          action_url: "/marketplace?category=new-arrivals"
        },
        {
          id: 3,
          image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
          title: "Limited Time Offers",
          subtitle: "Grab them before they're gone",
          action_url: "/marketplace?category=limited-offers"
        }
      ];
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (!banners.length) return null;

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-[200px] md:h-[300px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative">
            <img 
              src={banner.image_url} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{banner.title}</h2>
              <p className="text-lg text-white/90 mb-4">{banner.subtitle}</p>
              <Button className="w-fit">Shop Now</Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full"
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
