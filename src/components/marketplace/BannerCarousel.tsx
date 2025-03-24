
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds, incrementAdView } from "@/services/adService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { BannerAd } from "@/components/ads/BannerAd";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const BannerCarousel = () => {
  const [progressValue, setProgressValue] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: bannerAds = [] } = useQuery({
    queryKey: ['banner-ads'],
    queryFn: () => fetchActiveAds(undefined, "banner", 5),
  });

  // Record views for the ads
  useEffect(() => {
    if (bannerAds?.length) {
      bannerAds.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [bannerAds]);

  // Handle progress bar animation
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
        // Move to next slide when progress completes
        setCurrentSlide((prev) => (prev + 1) % bannerAds.length);
        startTime = 0; // Reset start time for next slide
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [bannerAds.length, currentSlide]);

  if (!bannerAds.length) {
    // If no ads, return placeholder
    return (
      <Card className="w-full overflow-hidden bg-white dark:bg-zinc-950">
        <div className="bg-white dark:bg-zinc-950 aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1] flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-lg md:text-xl font-bold">Discover Great Deals</h3>
            <p className="text-sm text-muted-foreground">Explore our marketplace for special offers</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        autoplay
        interval={5000}
        setApi={(api) => {
          // Set current slide when carousel changes
          api?.on("select", () => {
            setCurrentSlide(api?.selectedScrollSnap() || 0);
            setProgressValue(0); // Reset progress when slide changes
          });
        }}
      >
        <CarouselContent>
          {bannerAds.map((ad) => (
            <CarouselItem key={ad.id} className="basis-full">
              <BannerAd ad={ad} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Progress value={progressValue} className="h-1 rounded-none bg-gray-200/50" indicatorClassName="bg-black dark:bg-white" />
      </div>
      
      {/* Slide indicators - small dots */}
      {bannerAds.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {bannerAds.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-black dark:bg-white scale-100' : 'bg-gray-400/50 scale-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
