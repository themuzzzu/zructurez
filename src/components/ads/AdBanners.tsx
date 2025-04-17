
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAdvertisementsByLocation, incrementAdClick, AdLocation } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

interface AdBannersProps {
  location: AdLocation;
  className?: string;
  limit?: number;
  variant?: "banner" | "square" | "slim" | "card";
}

export const AdBanners = ({ location, className, limit = 1, variant = "banner" }: AdBannersProps) => {
  const navigate = useNavigate();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  // Fetch ads for this location
  const { data: ads = [] } = useQuery({
    queryKey: ["ads", location],
    queryFn: () => getAdvertisementsByLocation(location, variant),
  });

  // Filter to limit number of ads shown
  const limitedAds = ads.slice(0, limit);

  // Ad rotation effect for multiple ads
  useEffect(() => {
    if (limitedAds.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % limitedAds.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(intervalId);
  }, [limitedAds.length]);

  // Track ad impressions when in view
  useEffect(() => {
    const trackImpressions = async () => {
      if (inView && limitedAds.length > 0) {
        try {
          const currentAd = limitedAds[currentAdIndex];
          await fetch(`https://kjmlxafygdzkrlopyyvk.supabase.co/functions/v1/ad-view?id=${currentAd.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error("Failed to track impression:", error);
        }
      }
    };

    trackImpressions();
  }, [inView, currentAdIndex, limitedAds]);

  // Handle ad click
  const handleAdClick = async (adId: string, referenceId?: string, adType?: string) => {
    try {
      // Track click
      await incrementAdClick(adId);

      // Navigate based on ad type
      if (referenceId && adType) {
        if (adType.includes("product")) {
          navigate(`/products/${referenceId}`);
        } else if (adType.includes("business")) {
          navigate(`/business/${referenceId}`);
        } else if (adType.includes("service")) {
          navigate(`/services/${referenceId}`);
        } else {
          // Default navigation
          navigate(`/${location}`);
        }
      }
    } catch (error) {
      console.error("Error handling ad click:", error);
    }
  };

  // If no ads, don't render anything
  if (limitedAds.length === 0) return null;

  // Get current ad
  const currentAd = limitedAds[currentAdIndex];

  // Render based on variant
  switch (variant) {
    case "slim":
      return (
        <div
          ref={ref}
          className={cn("w-full bg-muted/30 rounded-md overflow-hidden", className)}
          style={{ height: "60px" }}
        >
          <div
            className="w-full h-full flex items-center justify-between px-4 cursor-pointer"
            onClick={() => handleAdClick(currentAd.id, currentAd.reference_id, currentAd.type)}
          >
            <div className="flex items-center gap-2">
              {currentAd.image_url && (
                <img
                  src={currentAd.image_url}
                  alt={currentAd.title}
                  className="h-10 w-10 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium text-sm line-clamp-1">{currentAd.title}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8">
              Learn More
            </Button>
          </div>
        </div>
      );

    case "square":
      return (
        <Card
          ref={ref}
          className={cn("overflow-hidden cursor-pointer", className)}
          onClick={() => handleAdClick(currentAd.id, currentAd.reference_id, currentAd.type)}
        >
          {currentAd.image_url && (
            <div className="relative aspect-square">
              <img
                src={currentAd.image_url}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                Sponsored
              </div>
            </div>
          )}
          <CardContent className="p-3">
            <h3 className="font-medium line-clamp-1">{currentAd.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {currentAd.description}
            </p>
          </CardContent>
        </Card>
      );

    case "card":
      return (
        <Card
          ref={ref}
          className={cn("overflow-hidden", className)}
        >
          {currentAd.image_url && (
            <div className="relative h-40">
              <img
                src={currentAd.image_url}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                Sponsored
              </div>
            </div>
          )}
          <CardContent className="p-4">
            <h3 className="font-medium mb-1">{currentAd.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {currentAd.description}
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleAdClick(currentAd.id, currentAd.reference_id, currentAd.type)}
            >
              Learn More
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      );

    // Default banner style
    default:
      return (
        <div
          ref={ref}
          className={cn("w-full relative rounded-md overflow-hidden cursor-pointer", className)}
          style={{ height: "150px" }}
          onClick={() => handleAdClick(currentAd.id, currentAd.reference_id, currentAd.type)}
        >
          {currentAd.image_url ? (
            <>
              <img
                src={currentAd.image_url}
                alt={currentAd.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="font-semibold text-lg">{currentAd.title}</h3>
                <p className="text-sm text-white/80 line-clamp-1">{currentAd.description}</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40 flex flex-col justify-center p-4">
              <h3 className="font-semibold text-lg">{currentAd.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {currentAd.description}
              </p>
              <Button variant="outline" className="w-max mt-2">
                Learn More
              </Button>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            Sponsored
          </div>
        </div>
      );
  }
};

export default AdBanners;
