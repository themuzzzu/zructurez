
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/service-card/ServiceCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface RecommendedServicesProps {
  limit?: number;
  showTitle?: boolean;
}

export const RecommendedServices = ({
  limit = 4,
  showTitle = true
}: RecommendedServicesProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["recommended-services"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          // In a real app, this would use a recommendation algorithm
          // For now, we'll just get the most viewed services
          .order("views", { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching recommended services:", err);
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
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Recommended Services</span>
              <Button variant="ghost" size="sm">
                View all
                <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
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
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recommended Services</CardTitle>
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
            <ServiceCard 
              key={service.id}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
