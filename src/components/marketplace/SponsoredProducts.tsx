
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { SponsoredProduct } from "@/components/ads/SponsoredProduct";
import { useEffect } from "react";
import { incrementAdView } from "@/services/adService";

export const SponsoredProducts = () => {
  const { data: ads = [] } = useQuery({
    queryKey: ['sponsored-products'],
    queryFn: () => fetchActiveAds("product", undefined, 10),
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {ads.map((ad) => (
        <SponsoredProduct key={ad.id} ad={ad} />
      ))}
    </div>
  );
};
