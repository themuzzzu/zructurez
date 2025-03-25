
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BannerAdProps {
  ad: Advertisement;
  className?: string;
}

export function BannerAd({ ad, className }: BannerAdProps) {
  const navigate = useNavigate();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  
  useEffect(() => {
    const trackImpression = async () => {
      if (!hasTrackedView) {
        await incrementAdView(ad.id);
        setHasTrackedView(true);
      }
    };
    
    trackImpression();
  }, [ad.id, hasTrackedView]);
  
  const handleClick = async () => {
    await incrementAdClick(ad.id);
    
    // Direct the user to the appropriate page based on ad type
    if (ad.type === "product") {
      navigate(`/product/${ad.reference_id}`);
    } else if (ad.type === "business") {
      navigate(`/business/${ad.reference_id}`);
    } else if (ad.type === "service") {
      navigate(`/service/${ad.reference_id}`);
    } else {
      // Handle external URL or other ad types if needed
      window.open(ad.image_url, '_blank');
    }
  };
  
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={handleClick}
    >
      {ad.image_url ? (
        <div className="relative">
          <img 
            src={ad.image_url} 
            alt={ad.title}
            className="w-full h-40 md:h-60 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div>
              <h3 className="text-white text-lg font-semibold line-clamp-2">{ad.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{ad.description}</p>
              <div className="flex items-center text-white text-xs mt-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>Sponsored</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted">
          <h3 className="font-semibold">{ad.title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{ad.description}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <ExternalLink className="h-3 w-3 mr-1" />
            <span>Sponsored</span>
          </div>
        </div>
      )}
    </Card>
  );
}
