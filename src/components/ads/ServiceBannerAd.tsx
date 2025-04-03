
import { useState, useEffect } from "react";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { Skeleton } from "@/components/ui/skeleton";

export function ServiceBannerAd() {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['banner-ads', 'service'],
    queryFn: () => fetchActiveAds("service", "banner", 1),
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
      id: "fallback-service",
      title: "Promote Your Service Business",
      description: "Reach thousands of potential customers in your area",
      type: "service",
      reference_id: "",
      budget: 0,
      status: "active",
      image_url: "https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Advertise+Your+Services+Here",
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
