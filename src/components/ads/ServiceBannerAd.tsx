
import { useState, useEffect } from "react";
import { Advertisement, incrementAdClick, incrementAdView, AdType } from "@/services/adService";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function ServiceBannerAd({ maxAds = 1 }: { maxAds?: number }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['banner-ads', 'service', maxAds],
    queryFn: () => fetchActiveAds("service", "banner", maxAds),
    retry: 2,
    retryDelay: 1000,
    staleTime: 60000, // Cache for 1 minute
  });

  // Record views for the ads
  useEffect(() => {
    if (ads?.length) {
      try {
        ads.forEach(ad => {
          incrementAdView(ad.id);
        });
      } catch (error) {
        console.error("Error recording ad views:", error);
      }
    }
  }, [ads]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="w-full h-[120px] md:h-[180px] rounded-lg" />
      </div>
    );
  }

  if (error || !ads || !ads.length) {
    // Show as many fallback ads as requested
    const fallbackAds = Array(maxAds).fill(null).map((_, index) => ({
      id: `fallback-service-${index}`,
      title: "Promote Your Service Business",
      description: "Reach thousands of potential customers in your area",
      type: "service" as AdType,
      reference_id: "",
      budget: 0,
      status: "active" as "active" | "pending" | "rejected" | "expired",
      image_url: `https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Advertise+Your+Services+Here+${index + 1}`,
    }));
    
    return (
      <div className="mb-6 space-y-4">
        {fallbackAds.map((ad, index) => (
          <ErrorBoundary key={index}>
            <div className={isMobile ? "pb-2" : ""}>
              <BannerAd ad={ad} />
            </div>
          </ErrorBoundary>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {ads.map((ad, index) => (
        <ErrorBoundary key={ad.id}>
          <div className={isMobile ? "pb-2" : ""}>
            <BannerAd ad={ad} />
          </div>
        </ErrorBoundary>
      ))}
    </div>
  );
}
