import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface TrendingServicesProps {
  layout?: GridLayoutType;
}

// Define the service type
interface ServiceType {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  user_id: string;
  category?: string;
  location?: string;
  contact_info?: string;
}

export const TrendingServices = ({ layout = "grid3x3" }: TrendingServicesProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: services, isLoading } = useQuery<ServiceType[]>({
    queryKey: ['trending-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('views', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const getGridClasses = () => {
    switch (layout) {
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "list":
        return "flex flex-col gap-4";
      case "grid1x1":
        return "grid grid-cols-1 gap-4";
      case "single":
        return "grid grid-cols-1 gap-4 max-w-3xl mx-auto";
      case "grid3x3":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
  };
  
  // Handle horizontal scroll with buttons
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-1">
          <TrendingUp className="h-5 w-5 text-red-500" />
          Trending Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-1">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!services || services.length === 0) {
    return null;
  }
  
  // If we have the list layout or a grid, show appropriate view
  if (layout === "list" || layout.includes("grid")) {
    return (
      <div className="space-y-4 mb-8">
        <div className={getGridClasses()}>
          {services.map((service) => (
            <ServiceCard 
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              image_url={service.image_url}
              price={service.price}
              providerId={service.user_id}
              providerName="Service Provider"
              category={service.category}
              location={service.location}
              contact_info={service.contact_info}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/services?sort=trending')}
            className="gap-1"
          >
            View More <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  // Otherwise show the horizontal scrollable view (for mobile)
  return (
    <div className="space-y-4 mb-8 relative">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-500" />
          Trending Services
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/services')}
          className="gap-1"
        >
          View All
        </Button>
      </div>
      
      <div className="relative group">
        {/* Left scroll button */}
        <Button 
          onClick={() => scroll('left')}
          size="icon"
          variant="ghost" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-md hidden md:flex"
        >
          <ChevronLeft />
        </Button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 pb-2 pt-1 px-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service) => (
            <div key={service.id} className="min-w-[250px] sm:min-w-[280px] w-[70vw] max-w-[320px] flex-shrink-0 snap-start">
              <div className="relative h-full">
                <ServiceCard 
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  image_url={service.image_url}
                  price={service.price}
                  providerId={service.user_id}
                  providerName="Service Provider"
                  category={service.category}
                  location={service.location}
                  contact_info={service.contact_info}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <Button 
          onClick={() => scroll('right')}
          size="icon"
          variant="ghost" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-md hidden md:flex"
        >
          <ChevronRight />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/services?sort=trending')}
          className="gap-1"
        >
          View More <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
