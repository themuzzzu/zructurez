
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SponsoredServicesProps {
  limit?: number;
  showTitle?: boolean;
}

export const SponsoredServices = ({
  limit = 4,
  showTitle = true
}: SponsoredServicesProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["sponsored-services"],
    queryFn: async () => {
      try {
        // In a real app, we would have a sponsored field
        // For now, fetch recent services as a proxy for sponsored
        const { data, error } = await supabase
          .from("services")
          .select("*")
          // In a real app we'd filter by is_sponsored=true
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching sponsored services:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000 // 10 minutes
  });

  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              Sponsored Services
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              Sponsored Services
            </CardTitle>
            <Link to="/services">
              <Button variant="ghost" size="sm">
                View all
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div key={service.id} className="relative">
              <ServiceCard 
                id={service.id}
                title={service.title}
                description={service.description}
                image_url={service.image_url}
                price={service.price}
                providerName="Service Provider" // This should come from user data in a real app
                providerId={service.user_id}
                category={service.category}
                location={service.location}
                rating={4.5} // Default rating since it's not in the data
              />
              <Badge 
                className="absolute top-2 right-2 bg-yellow-500/90 text-xs"
                variant="secondary"
              >
                Sponsored
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
