
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds, incrementAdView } from "@/services/adService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BannerAd } from "@/components/ads/BannerAd";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BannerCarousel = () => {
  const [progressValue, setProgressValue] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);

  // Fetch banner ads from Supabase using the adService
  const { data: bannerAds = [] } = useQuery({
    queryKey: ['banner-ads'],
    queryFn: () => fetchActiveAds(undefined, "banner", 5),
  });

  // Record views for the ads when they are displayed
  useEffect(() => {
    if (bannerAds?.length) {
      bannerAds.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [bannerAds]);

  // Handle slide changes
  useEffect(() => {
    if (!bannerAds.length) return;
    
    if (api) {
      api.on("select", () => {
        setCurrentSlide(api.selectedScrollSnap());
        setProgressValue(0); // Reset progress when slide changes
      });
    }
  }, [api, bannerAds.length]);

  // Auto-scroll implementation with 5-second interval
  useEffect(() => {
    if (!bannerAds.length) return;
    
    let animationFrameId: number;
    let startTime: number;
    const duration = 5000; // 5 seconds per slide
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration * 100, 100);
      setProgressValue(progress);
      
      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (api) {
          api.scrollNext();
        } else {
          setCurrentSlide((prev) => (prev + 1) % bannerAds.length);
        }
        startTime = 0; // Reset start time for next slide
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bannerAds.length, currentSlide, api]);

  // Fallback content if no banner ads are available
  if (!bannerAds.length) {
    return (
      <Card className="w-full overflow-hidden bg-white dark:bg-zinc-950 mb-8">
        <div className="bg-white dark:bg-zinc-950 aspect-[16/5] sm:aspect-[16/4] flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-lg md:text-xl font-bold">Discover Great Deals</h3>
            <p className="text-sm text-muted-foreground mt-1">Explore our marketplace for special offers</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full relative mb-8">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {bannerAds.map((ad) => (
            <CarouselItem key={ad.id}>
              <BannerAd ad={ad} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 border border-white/40 bg-black/30 hover:bg-black/50">
          <ChevronLeft className="h-5 w-5 text-white" />
        </CarouselPrevious>
        
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 border border-white/40 bg-black/30 hover:bg-black/50">
          <ChevronRight className="h-5 w-5 text-white" />
        </CarouselNext>
      </Carousel>
      
      {/* Progress bar to indicate time until next slide */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Progress value={progressValue} className="h-1 rounded-none bg-gray-200/50" indicatorClassName="bg-primary" />
      </div>
      
      {/* Pagination dots for the carousel */}
      {bannerAds.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {bannerAds.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-100' : 'bg-white/50 scale-75'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
