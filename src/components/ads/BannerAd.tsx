
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { ExternalLink, Info, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        // Only track in production environment
        if (process.env.NODE_ENV === 'production') {
          await incrementAdView(ad.id);
        }
        setHasTrackedView(true);
      }
    };
    
    trackImpression();
  }, [ad.id, hasTrackedView]);
  
  const handleClick = async () => {
    // Only track in production environment
    if (process.env.NODE_ENV === 'production') {
      await incrementAdClick(ad.id);
    }
    
    // Direct the user to the appropriate page based on ad type
    if (ad.type === "product") {
      navigate(`/products/${ad.reference_id}`);
    } else if (ad.type === "business") {
      navigate(`/businesses/${ad.reference_id}`);
    } else if (ad.type === "service") {
      navigate(`/services/${ad.reference_id}`);
    } else {
      // Handle external URL or other ad types if needed
      window.open(ad.image_url, '_blank');
    }
  };
  
  // Extract price from description if available (e.g. "From ₹12,999*")
  const priceMatch = ad.description?.match(/([₹$][0-9,]+|[0-9]+%\s+Off)/i);
  const price = priceMatch ? priceMatch[0] : null;
  
  // Extract other details from description
  const details = ad.description?.replace(price || '', '').trim();
  
  // Get a badge label based on ad type
  const getBadgeLabel = () => {
    switch (ad.type) {
      case "product":
        return "Featured Product";
      case "business":
        return "Featured Business";
      case "service":
        return "Featured Service";
      default:
        return "Sponsored";
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
            className="w-full h-auto sm:h-60 md:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
            <div className="w-full max-w-xl">
              <Badge 
                variant="outline" 
                className="mb-2 border-white/40 text-white bg-black/20 backdrop-blur-sm"
              >
                {getBadgeLabel()}
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{ad.title}</h2>
              
              {price && (
                <p className="text-lg sm:text-xl font-semibold text-white/90 mb-1">{price}</p>
              )}
              
              {details && (
                <p className="text-sm text-white/80 mb-3 max-w-lg line-clamp-2">{details}</p>
              )}
              
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-1"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop Now
              </Button>
              
              <div className="flex items-center text-white/70 text-xs mt-4">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>Sponsored</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-[300px] flex items-center">
          <div className="max-w-xl">
            <Badge 
              variant="outline" 
              className="mb-2 border-white/40 text-white bg-white/10"
            >
              {getBadgeLabel()}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{ad.title}</h2>
            <p className="text-white/80 text-lg mb-6">{ad.description}</p>
            <Button 
              size="sm" 
              className="bg-white text-black hover:bg-white/90 transition-colors"
            >
              Learn More
            </Button>
            <div className="flex items-center text-white/70 text-xs mt-4">
              <Info className="h-3 w-3 mr-1" />
              <span>Sponsored</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
