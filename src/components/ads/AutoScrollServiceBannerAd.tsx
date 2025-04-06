
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageFallback } from "@/components/ui/image-fallback";
import { incrementAdClick, incrementAdView } from "@/services/adService";
import { useNavigate } from "react-router-dom";

// Guaranteed fallback service ads that don't rely on API fetching
const fallbackServiceAds = [
  {
    id: "fallback-service-1",
    title: "Professional Home Cleaning",
    description: "Book our top-rated cleaning professionals today. 20% off your first booking!",
    type: "service" as const,
    reference_id: "cleaning-service",
    status: "active" as const,
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&h=300&q=80",
  },
  {
    id: "fallback-service-2",
    title: "Expert Electrical Services",
    description: "Licensed electricians for all your needs. Same day service available!",
    type: "service" as const,
    reference_id: "electrical-service",
    status: "active" as const,
    image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&h=300&q=80",
  },
  {
    id: "fallback-service-3",
    title: "Professional Landscaping",
    description: "Transform your outdoor space with our expert landscaping team. Free consultations!",
    type: "service" as const,
    reference_id: "landscaping-service",
    status: "active" as const,
    image_url: "https://images.unsplash.com/photo-1589244159943-d78db1318f4b?auto=format&fit=crop&w=1200&h=300&q=80",
  }
];

export function AutoScrollServiceBannerAd({ maxAds = 3 }: { maxAds?: number }) {
  const navigate = useNavigate();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [trackedAds, setTrackedAds] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use the fallback ads directly instead of fetching to avoid errors
  const displayAds = fallbackServiceAds.slice(0, maxAds);
  
  // Handle auto-scrolling with progress bar
  useEffect(() => {
    if (isHovered || displayAds.length <= 1) return;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    const duration = 5000; // 5 seconds
    const interval = 50; // Update progress every 50ms
    let elapsed = 0;
    
    const updateProgress = () => {
      elapsed += interval;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setProgressValue(progress);
      
      if (elapsed < duration) {
        timerRef.current = setTimeout(updateProgress, interval);
      } else {
        // Move to next slide
        setCurrentAdIndex((prev) => (prev + 1) % displayAds.length);
        // Reset and start again
        elapsed = 0;
        timerRef.current = setTimeout(updateProgress, interval);
      }
    };
    
    timerRef.current = setTimeout(updateProgress, interval);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentAdIndex, displayAds.length, isHovered]);
  
  // Record views for the current ad
  useEffect(() => {
    if (displayAds?.length && currentAdIndex < displayAds.length) {
      const adId = displayAds[currentAdIndex].id;
      if (!trackedAds.has(adId)) {
        try {
          incrementAdView(adId).catch(err => console.error("Error tracking view:", err));
          setTrackedAds(prev => new Set([...prev, adId]));
        } catch (error) {
          console.error("Error recording ad view:", error);
        }
      }
    }
  }, [currentAdIndex, displayAds, trackedAds]);
  
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
  
  const handlePrevAd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handler
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentAdIndex((prev) => (prev - 1 + displayAds.length) % displayAds.length);
    setProgressValue(0);
  };
  
  const handleNextAd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handler
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentAdIndex((prev) => (prev + 1) % displayAds.length);
    setProgressValue(0);
  };
  
  if (!displayAds.length) {
    return null;
  }
  
  const currentAd = displayAds[currentAdIndex];
  
  return (
    <div 
      className="relative mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
        onClick={() => handleAdClick(currentAd.id, currentAd.reference_id)}
      >
        <div className="relative">
          <ImageFallback
            src={currentAd.image_url}
            alt={currentAd.title}
            fallbackSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=300&q=80"
            className="w-full aspect-[16/5] object-cover"
            aspectRatio="wide"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex items-center p-4 sm:p-6">
            <div className="w-full max-w-xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {currentAd.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 max-w-lg line-clamp-2">
                {currentAd.description}
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
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <Progress value={progressValue} className="h-1 rounded-none bg-gray-200/50" indicatorClassName="bg-primary" />
          </div>
          
          {/* Indicator dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {displayAds.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentAdIndex ? 'bg-white scale-100' : 'bg-white/50 scale-75'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentAdIndex(index);
                  setProgressValue(0);
                }}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
