import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRightCircle, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BusinessCardHeader } from './BusinessCardHeader';
import { BusinessCardRating } from './BusinessCardRating';
import { LazyImage } from '../ui/LazyImage';

// Simple business type definition to avoid complex typing
interface BusinessType {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url?: string;
  verified: boolean;
  is_open: boolean;
  average_rating: number;
  reviews_count: number;
  wait_time: string;
  closure_reason: string;
}

export function SuggestedBusinesses() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['suggested-businesses'],
    queryFn: async () => {
      try {
        // In a real app, this would use the user's preferences or location
        const { data, error } = await supabase
          .from('businesses')
          .select(`
            *,
            business_ratings (*)
          `)
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (error || !data || data.length === 0) {
          // Return mock data if no real data
          return Array(4).fill(null).map((_, i) => ({
            id: `suggested-${i}`,
            name: `Suggested Business ${i + 1}`,
            description: 'This business might interest you based on your preferences.',
            category: ['Cafe', 'Fitness', 'Electronics', 'Books'][i % 4],
            image_url: `https://source.unsplash.com/random/300x300?local&sig=${i}`,
            verified: i % 2 === 0,
            is_open: true,
            average_rating: 4.2,
            reviews_count: 36,
            wait_time: '',
            closure_reason: ''
          })) as BusinessType[];
        }
        
        return data.map(business => {
          const ratings = business.business_ratings || [];
          const totalRating = ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0);
          const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
          
          return {
            ...business,
            average_rating: averageRating,
            reviews_count: ratings.length,
            wait_time: business.wait_time || '',
            closure_reason: business.closure_reason || ''
          };
        }) as BusinessType[];
      } catch (err) {
        console.error('Error fetching suggested businesses:', err);
        return [];
      }
    },
    staleTime: 60000, // 1 minute
  });

  // Handle scrolling functions
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
      
      // Check scroll position after animation
      setTimeout(() => checkScrollPosition(), 300);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Suggested For You</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Suggested For You</h2>
        </div>
        <Button variant="link" className="text-primary font-medium flex items-center gap-1">
          View All <ArrowRightCircle size={16} />
        </Button>
      </div>
      
      <div className="relative group">
        {showLeftScroll && (
          <Button 
            variant="outline"
            size="icon"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm border"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {businesses.map((business) => (
            <Link
              key={business.id}
              to={`/businesses/${business.id}`}
              className="flex-none w-[275px] sm:w-[300px] max-w-[85vw] snap-start transition-transform hover:-translate-y-1 duration-200"
            >
              <Card className="overflow-hidden h-[200px] bg-black text-white">
                <div className="relative h-32">
                  {business.image_url ? (
                    <div className="h-full w-full overflow-hidden relative">
                      <LazyImage
                        src={business.image_url}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                    </div>
                  ) : (
                    <div className="h-full w-full bg-zinc-900">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <BusinessCardHeader 
                      name={business.name}
                      category={business.category}
                      is_open={business.is_open}
                      verified={business.verified || false}
                      wait_time={business.wait_time}
                      closure_reason={business.closure_reason}
                    />
                  </div>
                </div>
                
                <div className="p-3">
                  <BusinessCardRating 
                    rating={business.average_rating || 0}
                    reviews={business.reviews_count || 0}
                    businessId={business.id}
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {showRightScroll && (
          <Button 
            variant="outline"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm border"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
