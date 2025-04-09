import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Component to display sponsored services
 */
export const SponsoredServices = () => {
  const navigate = useNavigate();
  const { data: services, isLoading, error } = useQuery({ 
    queryKey: ['sponsored-services'],
    queryFn: fetchSponsoredServices
  });

  if (isLoading) return <ServicesSkeleton />;
  if (error) return <div>Error loading sponsored services</div>;
  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sponsored Services</h2>
        <Badge>Sponsored</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-4 space-y-2">
            <div className="h-32 overflow-hidden rounded-md">
              <img
                src={service.imageUrl || "/placeholder.svg"}
                alt={service.title}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-semibold">{service.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-semibold">₹{service.price}</span>
              <Button
                size="sm"
                onClick={() => {
                  toast.success("Added to cart!");
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Define interfaces
interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price: number;
  category?: string;
  location?: string;
  is_sponsored: boolean;
}

// Define type for the raw data from Supabase
interface SupabaseServiceData {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  price: number;
  user_id: string;
  category?: string;
  location?: string;
  contact_info?: string;
}

/**
 * Fetches sponsored services from Supabase
 */
async function fetchSponsoredServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .limit(4);

    if (error) throw error;
    if (!data) return [];
    
    // Map the raw data to our Service interface
    const services: Service[] = data.map((item: SupabaseServiceData) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      price: item.price,
      category: item.category,
      location: item.location,
      is_sponsored: true, // These are all sponsored
    }));

    return services;
  } catch (error) {
    console.error('Error fetching sponsored services:', error);
    return [];
  }
}

/**
 * Skeleton loader for services
 */
const ServicesSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Sponsored Services</h2>
      <Badge>Sponsored</Badge>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-4 space-y-2">
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-1/3 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);
