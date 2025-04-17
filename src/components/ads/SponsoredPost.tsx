
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface SponsoredPostProps {
  ad: Advertisement;
  className?: string;
}

export function SponsoredPost({ ad, className }: SponsoredPostProps) {
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
      navigate(`/products/${ad.reference_id}`);
    } else if (ad.type === "business") {
      navigate(`/businesses/${ad.reference_id}`);
    } else if (ad.type === "service") {
      navigate(`/services/${ad.reference_id}`);
    } else {
      window.open(ad.image_url || '', '_blank');
    }
  };
  
  return (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 relative">
        <Badge 
          variant="outline" 
          className="absolute top-2 right-2 bg-yellow-500/80 text-white text-xs"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Sponsored
        </Badge>
        
        <div className="flex gap-3">
          {ad.image_url && (
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-base line-clamp-1">{ad.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {ad.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
