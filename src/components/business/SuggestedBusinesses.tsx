
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRightCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BusinessCardHeader } from './BusinessCardHeader';
import { BusinessCardRating } from './BusinessCardRating';

export function SuggestedBusinesses() {
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['suggested-businesses'],
    queryFn: async () => {
      try {
        // Try to fetch businesses with high ratings
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
            id: `mock-${i}`,
            name: `Suggested Business ${i + 1}`,
            description: 'This business is recommended based on your interests and location.',
            category: ['Service', 'Education', 'Entertainment', 'Finance'][i % 4],
            image_url: `https://source.unsplash.com/random/300x300?shop&sig=${i}`,
            verified: i % 2 === 0,
            is_open: i % 3 !== 0,
            average_rating: 4.3,
            reviews_count: 27,
            wait_time: null,
            closure_reason: null
          }));
        }
        
        return data.map(business => {
          const ratings = business.business_ratings || [];
          const totalRating = ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0);
          const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
          
          return {
            ...business,
            average_rating: averageRating,
            reviews_count: ratings.length,
            wait_time: business.wait_time || null,
            closure_reason: business.closure_reason || null
          };
        });
      } catch (err) {
        console.error('Error fetching suggested businesses:', err);
        return [];
      }
    },
    staleTime: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Suggested For You</h2>
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
          <ThumbsUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Suggested For You</h2>
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
                  <div className="h-32 w-full overflow-hidden">
                    <img 
                      src={business.image_url} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                  </div>
                ) : (
                  <div className="h-32 w-full bg-zinc-900" />
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <BusinessCardHeader 
                    name={business.name}
                    category={business.category}
                    is_open={business.is_open}
                    verified={business.verified || false}
                    wait_time={business.wait_time || null}
                    closure_reason={business.closure_reason || null}
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
