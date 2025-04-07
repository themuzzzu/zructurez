
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "@/components/BusinessCard";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export const SponsoredBusinesses = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['sponsored-businesses'],
    queryFn: async () => {
      try {
        // Try to fetch sponsored businesses
        const { data: adData, error: adError } = await supabase
          .from('advertisements')
          .select('id, title, description, image_url, reference_id')
          .eq('type', 'business')
          .eq('status', 'active')
          .limit(6);
          
        if (adError) throw adError;
        
        if (!adData || adData.length === 0) {
          // Fall back to featured businesses if no ads
          const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('verified', true)
            .order('created_at', { ascending: false })
            .limit(6);
            
          if (error) throw error;
          return data || [];
        }
        
        // Fetch business details for the sponsored businesses
        const businessIds = adData.map(ad => ad.reference_id);
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .in('id', businessIds);
          
        if (businessError) throw businessError;
        
        return businessData || [];
      } catch (err) {
        console.error("Error fetching sponsored businesses:", err);
        return [];
      }
    }
  });
  
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
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Sponsored Businesses
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
  
  if (!businesses || businesses.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8 relative">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Sponsored Businesses
        </h3>
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
          {businesses.map((business) => (
            <div key={business.id} className="min-w-[250px] sm:min-w-[280px] w-[70vw] max-w-[320px] flex-shrink-0 snap-start">
              <div className="relative h-full">
                <BusinessCard 
                  id={business.id}
                  name={business.name}
                  description={business.description}
                  image={business.image_url}
                  rating={4.5}
                  reviews={12}
                  verified={business.verified}
                  category={business.category}
                  location={business.location}
                  contact={business.contact || ""}
                  hours={business.hours || ""}
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
    </div>
  );
};
