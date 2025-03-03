
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

export const MarketplaceBanner = () => {
  const { data: banners = [] } = useQuery({
    queryKey: ['marketplace-banners'],
    queryFn: async () => {
      // Example banners - in a real app, these would come from the database
      return [
        {
          id: 1,
          image_url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
          title: "Limited Time Offers",
          subtitle: "Grab them before they're gone",
          action_url: "/marketplace?category=limited-offers",
          button_text: "Shop Now"
        },
        {
          id: 2,
          image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
          title: "Summer Sale",
          subtitle: "Up to 50% off on all products",
          action_url: "/marketplace?category=summer-sale",
          button_text: "View Deals"
        },
        {
          id: 3,
          image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
          title: "New Arrivals",
          subtitle: "Check out our latest collection",
          action_url: "/marketplace?category=new-arrivals",
          button_text: "Explore"
        }
      ];
    }
  });

  if (!banners.length) return null;

  return (
    <div className="relative">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[200px] md:h-[300px] w-full overflow-hidden rounded-lg">
                <img 
                  src={banner.image_url} 
                  alt={banner.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{banner.title}</h2>
                  <p className="text-lg text-white/90 mb-4 max-w-md">{banner.subtitle}</p>
                  <Button className="w-fit" size="lg">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {banner.button_text}
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/80 hover:bg-background text-foreground" />
        <CarouselNext className="right-2 bg-background/80 hover:bg-background text-foreground" />
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-white/50 transition-all duration-300"
              onClick={() => {
                // Dot navigation would be implemented with API from useCarousel
              }}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
