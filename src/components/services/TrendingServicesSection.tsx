
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingServicesInArea } from "@/services/serviceService";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/ServiceCard";
import { formatPrice } from "@/utils/productUtils";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const TrendingServicesSection = () => {
  const navigate = useNavigate();
  const { data: trendingServices, isLoading, isError } = useQuery({
    queryKey: ['trending-services'],
    queryFn: () => getTrendingServicesInArea(""),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Trending Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(4).fill(null).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.log("Error fetching trending services");
    // Fallback to static data in case of an error
  }

  // Use trending services data or fallback to default services
  const services = trendingServices || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Trending Services</h2>
        <Button variant="outline" onClick={() => navigate('/search?type=service&sort=trending')}>
          View All
        </Button>
      </div>

      {/* Insert a banner ad */}
      <div className="mb-6">
        <ServiceBannerAd maxAds={1} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            name={service.title}
            description={service.description || ""}
            image_url={service.image_url}
            price={formatPrice(service.price || 0)}
            providerName={service.provider_name || "Service Provider"}
            providerId={service.user_id || ""}
          />
        ))}
      </div>
    </div>
  );
};
