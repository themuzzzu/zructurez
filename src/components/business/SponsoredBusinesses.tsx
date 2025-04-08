
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRightCircle, Store } from 'lucide-react';
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

export function SponsoredBusinesses() {
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['sponsored-businesses'],
    queryFn: async () => {
      try {
        // Try to fetch sponsored businesses (those with paid promotions)
        const { data, error } = await supabase
          .from('businesses')
          .select(`
            *,
            business_ratings (*)
          `)
          .limit(4);
          
        if (error || !data || data.length === 0) {
          // Return mock data if no real data
          return Array(4).fill(null).map((_, i) => ({
            id: `mock-${i}`,
            name: `Sponsored Business ${i + 1}`,
            description: 'This is a featured business with premium services and great reviews.',
            category: ['Restaurant', 'Health', 'Retail', 'Technology'][i % 4],
            image_url: `https://source.unsplash.com/random/300x300?business&sig=${i}`,
            verified: true,
            is_open: true,
            average_rating: 4.5,
            reviews_count: 48,
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
        console.error('Error fetching sponsored businesses:', err);
        return [];
      }
    },
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sponsored Businesses</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
          <Store className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Sponsored Businesses</h2>
        </div>
        <Button variant="link" className="text-primary font-medium flex items-center gap-1">
          View All <ArrowRightCircle size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {businesses.map((business) => (
          <Link
            key={business.id}
            to={`/businesses/${business.id}`}
            className="block h-full transition-transform hover:-translate-y-1 duration-200"
          >
            <Card className="overflow-hidden h-full bg-black text-white">
              <div className="relative">
                {business.image_url ? (
                  <div className="h-32 w-full overflow-hidden relative">
                    <LazyImage 
                      src={business.image_url} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                  </div>
                ) : (
                  <div className="h-32 w-full bg-zinc-900" />
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
    </div>
  );
}
