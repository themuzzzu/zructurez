
import { useEffect, useState } from "react";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { getTrendingServicesInArea } from "@/services/serviceService";
import { TrendingUp } from "lucide-react"; // Using TrendingUp instead of Trending

interface TrendingServicesSectionProps {
  location?: string;
  limit?: number;
}

export const TrendingServicesSection = ({ location, limit = 4 }: TrendingServicesSectionProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTrendingServices = async () => {
      try {
        setIsLoading(true);
        const trendingServices = await getTrendingServicesInArea(location, limit);
        setServices(trendingServices);
      } catch (err) {
        console.error('Error fetching trending services:', err);
        setError('Failed to load trending services');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingServices();
  }, [location, limit]);
  
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
    return <div className="text-center text-muted-foreground py-4">No trending services found</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service) => (
        <ServiceCard 
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          image_url={service.image_url}
          price={service.price}
          providerName={service.provider_name}
          providerId={service.user_id}
          category={service.category}
          location={service.location}
          rating={service.rating}
        />
      ))}
    </div>
  );
};
