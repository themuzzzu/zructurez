
import { useState, useEffect } from "react";
import { Advertisement, incrementAdClick, incrementAdView, AdType } from "@/services/adService";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ServiceBannerAd({ maxAds = 1 }: { maxAds?: number }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['banner-ads', 'service', maxAds],
    queryFn: () => fetchActiveAds("service", "banner", maxAds),
  });

  // Record views for the ads
  useEffect(() => {
    if (ads?.length) {
      ads.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [ads]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="w-full h-[120px] md:h-[180px] rounded-lg" />
      </div>
    );
  }

  if (!ads.length) {
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
          <div key={index} className={isMobile ? "pb-2" : ""}>
            <BannerAd ad={ad} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {ads.map((ad, index) => (
        <div key={ad.id} className={isMobile ? "pb-2" : ""}>
          <BannerAd ad={ad} />
        </div>
      ))}
    </div>
  );
}
