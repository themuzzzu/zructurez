
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "@/components/BusinessCard";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export const SuggestedBusinesses = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['suggested-businesses'],
    queryFn: async () => {
      try {
        // For suggestion algorithm, get newest businesses
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching suggested businesses:", err);
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
          <Lightbulb className="h-5 w-5 text-blue-500" />
          Suggested Businesses
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
          <Lightbulb className="h-5 w-5 text-blue-500" />
          Suggested Businesses
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
                  reviews={5}
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
