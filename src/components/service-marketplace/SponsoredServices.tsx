
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Component to display sponsored services
 */
export const SponsoredServices = () => {
  const navigate = useNavigate();
  const { data: services, isLoading } = useQuery({ 
    queryKey: ['sponsored-services'],
    queryFn: fetchSponsoredServices
  });

  if (isLoading) return <ServicesSkeleton />;
  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Sponsored Services
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden h-full flex flex-col">
            <div className="h-40 overflow-hidden">
              <img
                src={service.imageUrl || "/placeholder.svg"}
                alt={service.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="p-4 space-y-2 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold line-clamp-1">{service.title}</h3>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Sponsored
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
              <div className="font-semibold">₹{service.price}</div>
            </div>
            <div className="p-4 pt-0 mt-auto">
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => navigate(`/services/${service.id}/book`)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Book
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (service.contact_info) {
                      window.location.href = `tel:${service.contact_info}`;
                    } else {
                      toast.error("Contact information not available");
                      navigate(`/services/${service.id}`);
                    }
                  }}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (service.contact_info) {
                      window.open(`https://wa.me/${service.contact_info.replace(/\D/g, '')}?text=Hi, I'm interested in your service: ${service.title}`, '_blank');
                    } else {
                      toast.error("Contact information not available");
                      navigate(`/services/${service.id}`);
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
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
  contact_info?: string;
  is_sponsored: boolean;
}

/**
 * Fetches sponsored services from Supabase
 */
async function fetchSponsoredServices(): Promise<Service[]> {
  try {
    // In a real app, we would filter for sponsored services
    // For now, we're just getting recent services
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .limit(4)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];
    
    // Map the raw data to our Service interface
    const services: Service[] = data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      price: item.price,
      category: item.category,
      location: item.location,
      contact_info: item.contact_info,
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
  <div className="space-y-4 mb-8">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Sponsored Services</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="p-4 pt-0">
            <div className="flex justify-between">
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
