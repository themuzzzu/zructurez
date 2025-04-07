
import { useState, useEffect } from "react";
import { Advertisement } from "@/services/adService";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds, incrementAdClick, incrementAdView } from "@/services/adService";
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
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);
    
    const fallbackAd: Advertisement = {
      id: "fallback-service",
      title: "Promote Your Service Business",
      description: "Reach thousands of potential customers in your area",
      type: "service",
      reference_id: "",
      budget: 0,
      status: "active",
      image_url: "https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Advertise+Your+Services+Here",
      location: "service",
      start_date: now.toISOString(),
      end_date: future.toISOString(),
      clicks: 0,
      impressions: 0,
      format: "banner",
      user_id: "system",
      created_at: now.toISOString()
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
