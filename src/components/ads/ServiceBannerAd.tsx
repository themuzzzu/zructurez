
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageFallback } from "@/components/ui/image-fallback";
import { incrementAdClick, incrementAdView } from "@/services/adService";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

// Create reliable service banner ad data with guaranteed images
const reliableServiceAds = [
  {
    id: "service-ad-1",
    title: "Home Cleaning Services",
    description: "Professional house cleaning with trusted experts. Book today!",
    type: "service" as const,
    reference_id: "cleaning-services",
    status: "active" as const,
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&h=300&q=80",
  },
  {
    id: "service-ad-2",
    title: "Plumbing Solutions",
    description: "Expert plumbing repairs and installations. Available 24/7 for emergencies.",
    type: "service" as const,
    reference_id: "plumbing-services",
    status: "active" as const,
    image_url: "https://images.unsplash.com/photo-1606321022034-31968bb41e4c?auto=format&fit=crop&w=1200&h=300&q=80",
  }
];

export function ServiceBannerAd({ maxAds = 1 }: { maxAds?: number }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  
  // Use slice to limit the number of ads shown
  const displayAds = reliableServiceAds.slice(0, maxAds);
  
  // Record views for the ads
  useEffect(() => {
    if (displayAds.length && !hasTrackedView) {
      try {
        displayAds.forEach(ad => {
          incrementAdView(ad.id).catch(err => console.error("View tracking error:", err));
        });
        setHasTrackedView(true);
      } catch (error) {
        console.error("Error recording ad views:", error);
        setHasTrackedView(true);  // Mark as tracked to prevent repeated attempts
      }
    }
  }, [displayAds, hasTrackedView]);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="w-full h-[120px] md:h-[180px] rounded-lg" />
      </div>
    );
  }
  
  if (displayAds.length === 0) {
    return null;
  }
  
  const handleAdClick = (adId: string, referenceId: string) => {
    try {
      incrementAdClick(adId);
      navigate(`/services/${referenceId}`);
    } catch (error) {
      console.error("Error handling ad click:", error);
      // Still navigate even if tracking fails
      navigate(`/services/${referenceId}`);
    }
  };
  
  return (
    <div className="mb-6 space-y-4">
      {displayAds.map((ad) => (
        <Card 
          key={ad.id}
          className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleAdClick(ad.id, ad.reference_id)}
        >
          <div className="relative">
            <ImageFallback
              src={ad.image_url}
              alt={ad.title}
              fallbackSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=300&q=80"
              className="w-full aspect-[16/5] object-cover"
              aspectRatio="wide"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex items-center p-4 sm:p-6">
              <div className="w-full max-w-xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                  {ad.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 max-w-lg line-clamp-2">
                  {ad.description}
                </p>
                <Button 
                  size="sm" 
                  className="bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
