import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from "@/components/ServiceCard";
import { RankingsTabs } from "./RankingsTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/utils/productUtils";

export const ServiceRankings = () => {
  const { data: topViewedServices, isLoading } = useQuery({
    queryKey: ['top-viewed-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('views', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Rankings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  const services = topViewedServices || [];

  if (services.length === 0) {
    return null;
  }

  return (
    <RankingsTabs
      type="services"
      items={services}
      renderItem={(service) => (
        <ServiceCard
          id={service.id}
          name={service.title}
          description={service.description}
          image={service.image_url}
          price={formatPrice(service.price)}
          providerName="Service Provider"
          providerId={service.user_id}
        />
      )}
    />
  );
};
