
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ImageFallback } from "@/components/ui/image-fallback";
import { Shimmer } from "@/components/ui/shimmer";

interface AdCardProps {
  ad: Advertisement;
  className?: string;
}

// Function to validate if a string is a UUID
const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export function AdCard({ ad, className }: AdCardProps) {
  const navigate = useNavigate();
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Handle tracking ad view
    const trackImpression = async () => {
      if (hasTrackedView) return;
      
      try {
        // Only try to increment view if it's a valid UUID
        if (isValidUuid(ad.id)) {
          await incrementAdView(ad.id);
        } else {
          console.log(`Skipping view tracking for non-UUID ad id: ${ad.id}`);
        }
        
        setHasTrackedView(true);
      } catch (error) {
        console.error("Error incrementing ad view:", error);
        // Still mark as tracked to avoid multiple failed attempts
        setHasTrackedView(true);
      }
    };
    
    trackImpression();
  }, [ad.id, hasTrackedView]);
  
  const handleClick = async () => {
    try {
      // Only try to increment click if it's a valid UUID
      if (isValidUuid(ad.id)) {
        await incrementAdClick(ad.id);
      } else {
        console.log(`Skipping click tracking for non-UUID ad id: ${ad.id}`);
      }
      
      // Direct the user to the appropriate page based on ad type
      if (ad.type === "product") {
        navigate(`/products/${ad.reference_id}`);
      } else if (ad.type === "business") {
        navigate(`/businesses/${ad.reference_id}`);
      } else if (ad.type === "service") {
        navigate(`/services/${ad.reference_id}`);
      } else {
        // Handle external URL if needed
        if (ad.reference_id && ad.reference_id.startsWith('http')) {
          window.open(ad.reference_id, '_blank');
        } else {
          // Fallback to navigating to the image URL
          navigate(`/ad/${ad.id}`);
        }
      }
    } catch (error) {
      console.error("Error handling ad click:", error);
    }
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setError(new Error("Failed to load image"));
    setIsLoading(false);
  };
  
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={handleClick}
    >
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Shimmer className="w-full h-full" />
          </div>
        )}
        
        <ImageFallback
          src={ad.image_url || ""}
          alt={ad.title}
          fallbackSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&q=80"
          className="w-full aspect-square object-cover"
          aspectRatio="square"
          onLoad={handleImageLoad}
        />
        
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-primary/30 backdrop-blur-sm text-xs"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Sponsored
        </Badge>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-2 text-sm">{ad.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ad.description}</p>
      </CardContent>
    </Card>
  );
}
