
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { useEffect } from "react";
import { incrementAdView } from "@/services/adService";

export const MarketplaceBanner = () => {
  const { data: bannerAds = [] } = useQuery({
    queryKey: ['marketplace-banner-ads'],
    queryFn: () => fetchActiveAds(undefined, 1),
  });

  // Record views for the ads
  useEffect(() => {
    if (bannerAds?.length) {
      bannerAds.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [bannerAds]);

  if (!bannerAds.length) {
    // Default banner if no ads
    return (
      <div className="w-full rounded-lg overflow-hidden aspect-[8/2] sm:aspect-[8/1.5] md:aspect-[8/1.5] bg-gradient-to-r from-primary to-primary-foreground/20">
        <div className="h-full w-full flex flex-col justify-center p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to Marketplace</h2>
          <p className="max-w-xl text-white/90 text-sm md:text-base">
            Discover great products and services from your local community
          </p>
        </div>
      </div>
    );
  }

  return <BannerAd ad={bannerAds[0]} />;
};
