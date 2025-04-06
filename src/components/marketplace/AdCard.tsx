
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ImageFallback } from "@/components/ui/image-fallback";

interface AdCardProps {
  ad: Advertisement;
  className?: string;
}

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
        await incrementAdView(ad.id);
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
    } catch (error) {
      console.error("Error handling ad click:", error);
    }
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = (error: any) => {
    console.error("Error loading ad image:", error);
    setError(error);
    setIsLoading(false);
  };
  
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${className}`}
      onClick={handleClick}
    >
      <div className="relative">
        <ImageFallback
          src={ad.image_url}
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
