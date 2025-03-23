
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { useEffect } from "react";
import { incrementAdView } from "@/services/adService";

export const MarketplaceBanner = () => {
  const { data: ads = [] } = useQuery({
    queryKey: ['marketplace-banner'],
    queryFn: () => fetchActiveAds(undefined, "banner", 1),
  });

  // Record views for the ads
  useEffect(() => {
    if (ads?.length) {
      ads.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [ads]);

  if (!ads.length) return null;

  return (
    <div className="w-full mb-6">
      <BannerAd ad={ads[0]} />
    </div>
  );
};
