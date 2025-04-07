
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface SponsoredServicesProps {
  layout?: GridLayoutType;
}

// Define the service type
interface ServiceType {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  user_id: string;
  category?: string;
  location?: string;
  contact_info?: string;
  is_sponsored: boolean;
}

export const SponsoredServices = ({ layout = "grid3x3" }: SponsoredServicesProps) => {
  const navigate = useNavigate();
  
  const { data: services, isLoading } = useQuery<ServiceType[]>({
    queryKey: ['sponsored-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_sponsored', true)
        .limit(6);
      
      if (error) throw error;
      
      // Ensure that the returned data matches the ServiceType interface by explicitly mapping it
      return (data || []).map(service => ({
        ...service,
        is_sponsored: true
      })) as ServiceType[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const getGridClasses = () => {
    switch (layout) {
      case "grid4x4":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case "list":
        return "flex flex-col gap-4";
      case "grid1x1":
        return "grid grid-cols-1 gap-4";
      case "single":
        return "grid grid-cols-1 gap-4 max-w-3xl mx-auto";
      case "grid3x3":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
  
  if (!services || services.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8">
      <div className={getGridClasses()}>
        {services.map((service) => (
          <ServiceCard 
            key={service.id}
            id={service.id}
            name={service.title}
            description={service.description}
            image={service.image_url || ''}
            price={`$${service.price.toFixed(2)}`}
            providerId={service.user_id}
            providerName="Service Provider"
            contact_info={service.contact_info}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/services?sponsored=true')}
          className="gap-1"
        >
          View More <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
