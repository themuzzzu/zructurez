
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdType, AdFormat, Advertisement } from "@/services/adService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageFallback } from "@/components/ui/image-fallback";

// Sample banner ad data with fixed image URLs
const sampleBannerAds: Advertisement[] = [
  {
    id: "1",
    title: "Orient Electric Cooling Days",
    description: "Sleek. Slim. Stunning. Up to 40% Off. Next-gen BLDC fans. 10% Instant Discount on Credit Card & EMI Transactions.",
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=400&q=80",
    business_id: "orient-electric",
    type: "product" as AdType,
    reference_id: "fan-collection",
    budget: 5000,
    format: "banner" as AdFormat,
    status: "active"
  },
  {
    id: "2",
    title: "Summer Fashion Sale",
    description: "Upgrade your wardrobe with the latest summer collection. Up to 50% off on all items.",
    image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop&w=1200&h=400",
    business_id: "fashion-hub",
    type: "business",
    reference_id: "summer-collection",
    budget: 3500,
    format: "banner",
    status: "active"
  },
  {
    id: "3",
    title: "Premium Electronics",
    description: "Latest gadgets and electronics at unbeatable prices. Free delivery on orders above $100.",
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1901&auto=format&fit=crop&w=1200&h=400",
    business_id: "tech-world",
    type: "product",
    reference_id: "electronics-sale",
    budget: 4000,
    format: "banner",
    status: "active"
  }
];

export const BannerCarousel = () => {
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use the sample banner ads instead of fetching from API for now
  const bannerAds = sampleBannerAds;

  useEffect(() => {
    // Set loading false after a short delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Auto-scroll implementation with 3-second interval
  useEffect(() => {
    if (!bannerAds.length || isHovered || isLoading) return;
    
    let animationFrameId: number;
    let startTime: number;
    const duration = 3000; // 3 seconds per slide
    
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
  }, [bannerAds.length, currentSlide, api, isHovered, isLoading]);

  // Handle banner click to navigate to appropriate page
  const handleBannerClick = (ad: Advertisement) => {
    try {
      if (ad.type === "product") {
        navigate(`/product/${ad.reference_id}`);
      } else if (ad.type === "business") {
        navigate(`/businesses/${ad.reference_id}`);
      } else if (ad.type === "service") {
        navigate(`/services/${ad.reference_id}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

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
    <div 
      className="w-full relative mb-8 px-2 sm:px-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="!ml-0">
          {bannerAds.map((ad) => (
            <CarouselItem key={ad.id} className="!pl-0 sm:!pl-4 cursor-pointer" onClick={() => handleBannerClick(ad)}>
              <div className="relative">
                <div className="relative">
                  <ImageFallback
                    src={ad.image_url}
                    alt={ad.title}
                    fallbackSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=400&q=80"
                    className="w-full h-full object-cover aspect-[16/9] rounded-lg"
                    aspectRatio="wide"
                    priority={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent flex items-center p-4 sm:p-6 rounded-lg">
                    <div className="w-full max-w-xl">
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
                      
                      <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 max-w-lg line-clamp-2">
                        {ad.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 border border-white/40 bg-black/30 hover:bg-black/50 z-10">
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </CarouselPrevious>
        
        <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 border border-white/40 bg-black/30 hover:bg-black/50 z-10">
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </CarouselNext>
      </Carousel>
      
      {/* Progress bar to indicate time until next slide */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Progress value={progressValue} className="h-1 rounded-none bg-gray-200/50" indicatorClassName="bg-primary" />
      </div>
      
      {/* Pagination dots for the carousel */}
      {bannerAds.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {bannerAds.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
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
