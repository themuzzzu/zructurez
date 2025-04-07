
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageFallback } from "@/components/ui/image-fallback";
import { incrementAdClick, incrementAdView, Advertisement } from "@/services/adService";
import { useNavigate } from "react-router-dom";

interface AutoScrollingBannerAdProps {
  ads: Advertisement[];
  interval?: number; // in milliseconds
}

export const AutoScrollingBannerAd = ({ ads, interval = 5000 }: AutoScrollingBannerAdProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [viewedAds, setViewedAds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track ad views
  useEffect(() => {
    if (ads.length === 0) return;
    
    const currentAd = ads[currentIndex];
    if (!viewedAds.has(currentAd.id)) {
      incrementAdView(currentAd.id);
      setViewedAds(prev => new Set([...prev, currentAd.id]));
    }
  }, [currentIndex, ads, viewedAds]);
  
  // Handle auto-scrolling with progress
  useEffect(() => {
    if (ads.length <= 1 || isHovered) return;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up progress update
    const updateStep = 100 / (interval / 100); // Update progress every 100ms
    let currentProgress = 0;
    
    const progressInterval = setInterval(() => {
      currentProgress += updateStep;
      setProgress(Math.min(currentProgress, 100));
      
      if (currentProgress >= 100) {
        // Move to next slide
        setCurrentIndex((prev) => (prev + 1) % ads.length);
        currentProgress = 0;
        setProgress(0);
      }
    }, 100);
    
    intervalRef.current = progressInterval;
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, ads.length, interval, isHovered]);
  
  const handlePrev = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    setProgress(0);
  };
  
  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prev) => (prev + 1) % ads.length);
    setProgress(0);
  };
  
  const handleAdClick = (adId: string, type: string, referenceId: string) => {
    incrementAdClick(adId);
    
    // Navigate based on ad type
    if (type === "product") {
      navigate(`/products/${referenceId}`);
    } else if (type === "service") {
      navigate(`/services/${referenceId}`);
    } else if (type === "business") {
      navigate(`/businesses/${referenceId}`);
    } else {
      // For other types or external links
      if (referenceId.startsWith('http')) {
        window.open(referenceId, '_blank');
      }
    }
  };
  
  if (ads.length === 0) {
    return null;
  }
  
  const currentAd = ads[currentIndex];
  
  return (
    <div 
      className="relative mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
        onClick={() => handleAdClick(currentAd.id, currentAd.type, currentAd.reference_id)}
      >
        <div className="relative">
          <ImageFallback
            src={currentAd.image_url || ""}
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
              <p className="text-sm text-white/80 mb-3 max-w-lg line-clamp-2">
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
      
      {ads.length > 1 && (
        <>
          {/* Navigation buttons */}
          <Button 
            onClick={handlePrev} 
            size="icon"
            variant="outline"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 border border-white/40 hover:bg-black/50 z-10"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
            <span className="sr-only">Previous ad</span>
          </Button>
          
          <Button 
            onClick={handleNext} 
            size="icon"
            variant="outline"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 border border-white/40 hover:bg-black/50 z-10"
          >
            <ChevronRight className="h-4 w-4 text-white" />
            <span className="sr-only">Next ad</span>
          </Button>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <Progress value={progress} className="h-1 rounded-none bg-gray-200/50" indicatorClassName="bg-primary" />
          </div>
          
          {/* Indicator dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {ads.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white scale-100' : 'bg-white/50 scale-75'
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setProgress(0);
                }}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
