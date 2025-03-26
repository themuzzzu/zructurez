
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Advertisement, incrementAdClick, incrementAdView } from "@/services/adService";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";

interface SponsoredProductProps {
  ad: Advertisement;
  className?: string;
}

export function SponsoredProduct({ ad, className }: SponsoredProductProps) {
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
      // Handle external URL or other ad types if needed
      window.open(ad.image_url || '', '_blank');
    }
  };
  
  // Simulate some product data
  const price = Math.floor(Math.random() * 10000) + 999;
  const discount = Math.floor(Math.random() * 50) + 10;
  const rating = (Math.random() * 2 + 3).toFixed(1);
  
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md group ${className}`}
      onClick={handleClick}
    >
      <div className="relative">
        {ad.image_url ? (
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <div className="text-2xl font-bold text-primary">{ad.title.charAt(0)}</div>
          </div>
        )}
        
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-yellow-500/90 backdrop-blur-sm text-xs text-white border-0"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Ad
        </Badge>
        
        <Badge 
          variant="outline" 
          className="absolute bottom-2 left-2 bg-green-600 text-white border-0 text-xs"
        >
          {discount}% off
        </Badge>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-2 text-sm mb-1">{ad.title}</h3>
        
        <div className="flex items-center gap-1 text-xs mb-1">
          <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 h-5 px-1.5">
            <Star className="h-3 w-3 fill-current mr-0.5" />
            {rating}
          </Badge>
          <span className="text-muted-foreground">Featured</span>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold">₹{price.toLocaleString()}</span>
          <span className="text-xs line-through text-muted-foreground">
            ₹{Math.floor(price * (100 / (100 - discount))).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
