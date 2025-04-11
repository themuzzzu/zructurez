import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessCard } from "@/components/BusinessCard";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

export const TopRatedBusinesses = () => {
  const [api, setApi] = useState<any>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const navigate = useNavigate();
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['top-rated-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*, business_ratings(*)')
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      
      // Calculate average rating for each business
      return (data || []).map(business => {
        const ratings = business.business_ratings || [];
        const totalRating = ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
        
        return {
          ...business,
          average_rating: averageRating,
          reviews_count: ratings.length
        };
      })
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, 8);
    }
  });
  
  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!api || !autoScrollEnabled || !businesses || businesses.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, autoScrollEnabled, businesses]);
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            Top Rated Businesses
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
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
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          Top Rated Businesses
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-blue-600"
          onClick={() => navigate('/businesses')}
        >
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Carousel 
        className="w-full" 
        setApi={setApi}
        onMouseEnter={() => setAutoScrollEnabled(false)}
        onMouseLeave={() => setAutoScrollEnabled(true)}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {businesses.map((business) => (
            <CarouselItem key={business.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <BusinessCard 
                id={business.id}
                name={business.name}
                category={business.category}
                description={business.description || ""}
                image={business.image_url || '/placeholder.svg'}
                rating={business.average_rating || 0}
                reviews={business.reviews_count || 0}
                location={business.location || ''}
                contact={business.contact || ''}
                hours={business.hours || ''}
                verified={business.verified || false}
                appointment_price={business.appointment_price}
                consultation_price={business.consultation_price}
                is_open={business.is_open}
                wait_time={business.wait_time}
                closure_reason={business.closure_reason}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </Carousel>
    </div>
  );
};

// Add this default export
export default TopRatedBusinesses;
