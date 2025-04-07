
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/productUtils';
import { Badge } from '@/components/ui/badge';

export function SuggestedServices() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['suggested-services'],
    queryFn: async () => {
      try {
        // Try to fetch recommended services based on popularity
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('views', { ascending: false })
          .limit(4);
          
        if (error || !data || data.length === 0) {
          // Return mock data if no real data
          return Array(4).fill(null).map((_, i) => ({
            id: `mock-${i}`,
            title: `Suggested Service ${i + 1}`,
            description: 'This service is recommended based on your preferences and location.',
            price: 25 + (i * 10),
            image_url: `https://source.unsplash.com/random/300x200?service&sig=${i}`,
            category: ['Home', 'Professional', 'Personal', 'Business'][i % 4],
            location: 'Near you'
          }));
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching suggested services:', err);
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
            <Card key={i} className="h-64 animate-pulse bg-muted" />
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
        {services.map((service) => (
          <Link
            key={service.id}
            to={`/services/${service.id}`}
            className="block h-full transition-transform hover:-translate-y-1 duration-200"
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="h-40 overflow-hidden">
                <img 
                  src={service.image_url || 'https://placehold.co/300x200/e2e8f0/64748b?text=Service'} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="flex-1 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base line-clamp-1">{service.title}</h3>
                  {service.category && (
                    <Badge variant="outline" className="text-xs">{service.category}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold">{formatPrice(service.price)}</span>
                  {service.location && (
                    <span className="text-xs text-muted-foreground">{service.location}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
