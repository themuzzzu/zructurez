
import { useState, useEffect, useRef } from "react";
import { Advertisement, incrementAdClick, incrementAdView, AdType } from "@/services/adService";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { BannerAd } from "@/components/ads/BannerAd";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AutoScrollServiceBannerAd({ maxAds = 3 }: { maxAds?: number }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ['banner-ads', 'service', maxAds],
    queryFn: () => fetchActiveAds("service", "banner", maxAds),
    retry: 2,
    retryDelay: 1000,
    staleTime: 60000, // Cache for 1 minute
  });

  // Generate fallback ads if needed
  const fallbackAds = Array(maxAds).fill(null).map((_, index) => ({
    id: `fallback-service-${index}`,
    title: "Promote Your Service Business",
    description: "Reach thousands of potential customers in your area",
    type: "service" as AdType,
    reference_id: "",
    budget: 0,
    status: "active" as "active" | "pending" | "rejected" | "expired",
    image_url: `https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Advertise+Your+Services+Here+${index + 1}`,
  }));
  
  // Use ads from API or fallback if needed
  const displayAds = ads?.length > 0 ? ads : fallbackAds;
  
  // Record views for the current ad
  useEffect(() => {
    if (displayAds?.length && currentAdIndex < displayAds.length) {
      try {
        incrementAdView(displayAds[currentAdIndex].id);
      } catch (error) {
        console.error("Error recording ad view:", error);
      }
    }
  }, [currentAdIndex, displayAds]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovered || displayAds.length <= 1) return;
    
    const startAutoScroll = () => {
      timerRef.current = setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % displayAds.length);
      }, 3000); // 3 seconds interval
    };
    
    startAutoScroll();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentAdIndex, displayAds.length, isHovered]);
  
  const handlePrevAd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + displayAds.length) % displayAds.length);
  };
  
  const handleNextAd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % displayAds.length);
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="w-full h-[120px] md:h-[180px] rounded-lg" />
      </div>
    );
  }

  if (!displayAds.length) {
    return null;
  }

  return (
    <div 
      className="mb-6 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ErrorBoundary>
        <div className={isMobile ? "pb-2" : ""}>
          <BannerAd ad={displayAds[currentAdIndex]} />
        </div>
      </ErrorBoundary>
      
      {displayAds.length > 1 && (
        <>
          {/* Navigation buttons */}
          <Button 
            onClick={handlePrevAd} 
            size="icon"
            variant="outline"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 border border-white/40 hover:bg-black/50 z-10"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
            <span className="sr-only">Previous ad</span>
          </Button>
          
          <Button 
            onClick={handleNextAd} 
            size="icon"
            variant="outline"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 border border-white/40 hover:bg-black/50 z-10"
          >
            <ChevronRight className="h-4 w-4 text-white" />
            <span className="sr-only">Next ad</span>
          </Button>
          
          {/* Indicator dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {displayAds.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentAdIndex ? 'bg-white scale-100' : 'bg-white/50 scale-75'
                }`}
                onClick={() => setCurrentAdIndex(index)}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
