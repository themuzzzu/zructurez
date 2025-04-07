
import { useState, useEffect } from "react";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { Skeleton } from "@/components/ui/skeleton";

export function BusinessBannerAd() {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['banner-ads', 'business'],
    queryFn: () => fetchActiveAds("business", "banner", 1),
  });

  // Record views for the ad
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
        <Skeleton className="w-full h-[180px] md:h-[200px] rounded-lg" />
      </div>
    );
  }

  if (!ads.length) {
    const fallbackAd: Advertisement = {
      id: "fallback-business",
      title: "Promote Your Local Business",
      description: "Get discovered by customers in your neighborhood",
      type: "business",
      reference_id: "",
      budget: 0,
      status: "active",
      image_url: "https://via.placeholder.com/1200x300/22C55E/FFFFFF?text=Advertise+Your+Business+Here",
    };
    
    return (
      <div className="mb-6">
        <BannerAd ad={fallbackAd} />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <BannerAd ad={ads[0]} />
    </div>
  );
}
