
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { getRecommendedServices } from "@/services/serviceService";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface SuggestedServicesProps {
  layout?: GridLayoutType;
}

// Define the service type to avoid the deep instantiation error
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
  views?: number;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
}

export const SuggestedServices = ({ layout = "grid3x3" }: SuggestedServicesProps) => {
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  const { data: suggestedServices, isLoading } = useQuery<ServiceType[]>({
    queryKey: ['suggested-services', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        // If no user, fetch some default services
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .limit(6);
          
        if (error) throw error;
        return data || [];
      }
      
      // Otherwise get personalized recommendations
      return await getRecommendedServices(user.id);
    },
    enabled: !!user?.id,
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
  
  if (!suggestedServices || suggestedServices.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8">
      <div className={getGridClasses()}>
        {suggestedServices.map((service) => (
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
            contact_info={service.contact_info}
            providerName={service.profiles?.username || "Service Provider"}
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/services?recommended=true')}
          className="gap-1"
        >
          View More <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
