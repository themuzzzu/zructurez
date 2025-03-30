
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { ExternalLink, Info, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  
  // Extract price or discount from description if available (e.g. "From ₹12,999*" or "40% Off")
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
  
  // Get credit card and offer info if available in the description
  const creditCardMatch = ad.description?.match(/([\d]+%\s+Instant\s+Discount.+)/i);
  const creditCardInfo = creditCardMatch ? creditCardMatch[0] : null;
  
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow w-full ${className}`}
      onClick={handleClick}
    >
      {ad.image_url ? (
        <div className="relative">
          <AspectRatio ratio={16/9} className="overflow-visible">
            <div className="relative h-full">
              <img 
                src={ad.image_url} 
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex items-center p-4 sm:p-6">
                <div className="w-full max-w-xl">
                  <Badge 
                    variant="outline" 
                    className="mb-2 border-white/40 text-white bg-black/20 backdrop-blur-sm"
                  >
                    {getBadgeLabel()}
                  </Badge>
                  
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2">
                    {ad.title.includes("Orient Electric") ? (
                      <>
                        <div className="text-lg sm:text-2xl md:text-4xl">Sleek. Slim. Stunning.</div>
                        <div className="text-xl sm:text-3xl md:text-5xl mt-2 text-white">Up to 40% Off</div>
                        <div className="text-sm sm:text-lg md:text-xl mt-2 font-normal">Next-gen BLDC fans</div>
                      </>
                    ) : (
                      ad.title
                    )}
                  </h2>
                  
                  {creditCardInfo && (
                    <div className="mt-2 sm:mt-4 mb-2 sm:mb-3 bg-white/20 backdrop-blur-sm p-2 rounded-md inline-block">
                      <p className="text-white text-xs sm:text-sm font-medium">{creditCardInfo}</p>
                    </div>
                  )}
                  
                  {details && !creditCardInfo && (
                    <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 max-w-lg line-clamp-2">{details}</p>
                  )}
                  
                  <Button 
                    size="sm" 
                    className="bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-1 mt-2 sm:mt-3"
                  >
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Shop Now</span>
                  </Button>
                </div>
              </div>
            </div>
          </AspectRatio>
          
          {/* Sponsored tag - positioned at the bottom for better visibility on mobile */}
          <div className="absolute bottom-2 left-2 flex items-center bg-black/50 backdrop-blur-sm text-white/80 text-xs px-2 py-1 rounded-full">
            <ExternalLink className="h-3 w-3 mr-1" />
            <span>Sponsored</span>
          </div>
        </div>
      ) : (
        <AspectRatio ratio={16/9}>
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-full flex items-center">
            <div className="max-w-xl">
              <Badge 
                variant="outline" 
                className="mb-2 border-white/40 text-white bg-white/10"
              >
                {getBadgeLabel()}
              </Badge>
              <h2 className="text-xl sm:text-3xl font-bold mb-2">{ad.title}</h2>
              <p className="text-white/80 text-sm sm:text-lg mb-4 sm:mb-6">{ad.description}</p>
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-white/90 transition-colors"
              >
                Learn More
              </Button>
              
              <div className="flex items-center text-white/70 text-xs mt-4 bg-black/30 px-2 py-1 rounded-full inline-flex">
                <Info className="h-3 w-3 mr-1" />
                <span>Sponsored</span>
              </div>
            </div>
          </div>
        </AspectRatio>
      )}
    </Card>
  );
}

