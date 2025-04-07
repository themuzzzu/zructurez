
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from '@/components/service-card/ServiceCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TrendingServicesSection = () => {
  const navigate = useNavigate();

  const { data: services, isLoading } = useQuery({
    queryKey: ['trending-services'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('views', { ascending: false })
          .limit(4);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching trending services:', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleViewAll = () => {
    navigate('/services?sort=trending');
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Trending Services
          </h2>
          <Button variant="outline" onClick={handleViewAll}>View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-500" />
          Trending Services
        </h2>
        <Button variant="outline" onClick={handleViewAll}>
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            image_url={service.image_url}
            price={service.price}
            providerId={service.user_id}
            category={service.category}
            location={service.location}
            views={service.views}
            rating={4.5}
          />
        ))}
      </div>
    </div>
  );
};
