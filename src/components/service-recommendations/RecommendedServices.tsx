
import { useEffect, useState } from 'react';
import { ServiceCard } from '@/components/service-card/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface RecommendedServicesProps {
  userId?: string;
  limit?: number;
  userLocation?: string;
}

export const RecommendedServices = ({ userId, limit = 4, userLocation }: RecommendedServicesProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        // Get recommended services from the database
        let query = supabase
          .from('services')
          .select('*')
          .limit(limit);

        // Filter by user's location if provided
        if (userLocation) {
          query = query.ilike('location', `%${userLocation}%`);
        }

        const { data, error: apiError } = await query;

        if (apiError) throw apiError;
        setServices(data || []);
      } catch (err) {
        console.error('Error fetching recommended services:', err);
        setError('Failed to load recommended services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [userId, limit, userLocation]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(limit).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
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
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!services || services.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No recommended services found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => (
        <ServiceCard 
          key={service.id}
          id={service.id}
          title={service.title || service.name || "Unnamed Service"}
          description={service.description || ""}
          image_url={service.image_url}
          price={service.price || 0}
          providerName={service.provider_name || "Service Provider"}
          providerId={service.user_id}
          category={service.category}
          location={service.location}
          rating={service.rating || 4.5}
        />
      ))}
    </div>
  );
};
