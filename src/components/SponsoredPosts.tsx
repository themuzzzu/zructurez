
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { SponsoredPost } from "@/components/ads/SponsoredPost";
import { useEffect } from "react";
import { incrementAdView } from "@/services/adService";

export const SponsoredPosts = () => {
  const { data: ads = [] } = useQuery({
    queryKey: ['sponsored-posts'],
    queryFn: () => fetchActiveAds(undefined, undefined, 3),
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
    <div className="space-y-4">
      {ads.map((ad) => (
        <SponsoredPost key={ad.id} ad={ad} />
      ))}
    </div>
  );
};
