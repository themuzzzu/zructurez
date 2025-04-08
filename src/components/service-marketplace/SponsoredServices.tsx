
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { LoadingView } from "@/components/LoadingView";

interface SponsoredServicesProps {
  layout?: GridLayoutType;
}

// Define a completely standalone service type with no references to other types
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

/**
 * Fetches sponsored services from Supabase
 */
async function fetchSponsoredServices(): Promise<ServiceType[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_sponsored', true)
      .limit(6);
    
    if (error) throw error;
    
    // Return empty array if no data
    if (!data) return [];
    
    // Transform data to ensure it matches the ServiceType
    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      image_url: service.image_url,
      price: service.price,
      user_id: service.user_id,
      category: service.category,
      location: service.location,
      contact_info: service.contact_info,
      is_sponsored: true
    }));
  } catch (error) {
    console.error("Error fetching sponsored services:", error);
    return [];
  }
}

export function SponsoredServices({ layout = "grid3x3" }: SponsoredServicesProps) {
  const navigate = useNavigate();
  
  // Avoid complex type inference by using a simpler approach with basic types
  const query = useQuery({
    queryKey: ['sponsored-services'],
    queryFn: fetchSponsoredServices
  });
  
  // Manually extract and type the values we need
  const services: ServiceType[] = query.data || [];
  const isLoading: boolean = query.isLoading;
  const isError: boolean = query.isError;
  
  // Handle error state
  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load sponsored services.</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }
  
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
        <h2 className="text-2xl font-bold">Sponsored Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (services.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-2xl font-bold">Sponsored Services</h2>
      <div className={getGridClasses()}>
        {services.map((service) => (
          <ServiceCard 
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            image_url={service.image_url}
            price={service.price}
            providerId={service.user_id}
            providerName="Service Provider"
            contact_info={service.contact_info}
            category={service.category}
            location={service.location}
            sponsored={service.is_sponsored}
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
}
