
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Advertisement } from "@/services/adService";

interface BusinessBannerAdProps {
  businessId?: string;
}

export const BusinessBannerAd = ({ businessId }: BusinessBannerAdProps) => {
  const { data: ad, isLoading } = useQuery({
    queryKey: ['business-banner-ad', businessId],
    queryFn: async () => {
      if (!businessId) return null;
      
      const ads = await fetchActiveAds("business");
      
      // First try to find an ad for this specific business
      let matchingAd = ads.find(a => a.business_id === businessId);
      
      // If no specific ad, return any business ad
      if (!matchingAd && ads.length > 0) {
        matchingAd = ads[0];
      }
      
      return matchingAd;
    },
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-lg" />;
  }

  if (!ad) return null;

  // Create a complete Advertisement object
  const fullAd: Advertisement = {
    id: ad.id,
    title: ad.title,
    description: ad.description || "",
    type: "business",
    reference_id: ad.reference_id,
    budget: ad.budget || 0,
    status: "active",
    image_url: ad.image_url,
    user_id: ad.user_id || "", 
    format: ad.format || "banner",
    location: ad.location || "",
    start_date: ad.start_date || "",
    end_date: ad.end_date || "",
    impressions: ad.impressions || 0,
    clicks: ad.clicks || 0,
    video_url: null,
    carousel_images: null,
    created_at: ad.created_at || ""
  };

  return (
    <Link to={`/business/${ad.reference_id}`} className="block w-full">
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0 relative">
          {ad.image_url ? (
            <div 
              className="h-24 bg-cover bg-center w-full"
              style={{ backgroundImage: `url(${ad.image_url})` }}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="font-medium text-lg flex items-center gap-1">
                    {ad.title}
                    <ExternalLink size={16} />
                  </h3>
                  <p className="text-sm opacity-85">{ad.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-24 bg-muted flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="font-medium flex items-center gap-1">
                  {ad.title}
                  <ExternalLink size={16} />
                </h3>
                <p className="text-sm text-muted-foreground">{ad.description}</p>
              </div>
            </div>
          )}
          <div className="absolute top-1 right-2">
            <span className="text-xs text-white bg-primary/70 px-1.5 py-0.5 rounded-sm">Ad</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
