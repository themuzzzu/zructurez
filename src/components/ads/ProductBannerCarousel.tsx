
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageFallback } from "@/components/ui/image-fallback";
import { incrementAdView, incrementAdClick } from "@/services/adService";

// Product-specific banner advertisements
const productBannerAds = [
  {
    id: "product-banner-1",
    title: "Premium Smartphones",
    description: "The latest smartphones with cutting-edge features. Free shipping on all orders!",
    image_url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&h=400&q=80",
    reference_id: "smartphones",
    type: "product"
  },
  {
    id: "product-banner-2",
    title: "Stylish Home Furniture",
    description: "Transform your space with our premium furniture collection. 20% off this week only!",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&h=400&q=80",
    reference_id: "furniture",
    type: "product"
  },
  {
    id: "product-banner-3",
    title: "Premium Kitchenware",
    description: "Professional quality kitchen tools for the home chef. Free delivery on orders over $100.",
    image_url: "https://images.unsplash.com/photo-1556910103-1c02745aec78?auto=format&fit=crop&w=1200&h=400&q=80",
    reference_id: "kitchenware",
    type: "product"
  }
];

export function ProductBannerCarousel() {
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trackedAds, setTrackedAds] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set loading false after a short delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle slide changes
  useEffect(() => {
    if (!productBannerAds.length) return;
    
    if (api) {
      api.on("select", () => {
        const selectedIndex = api.selectedScrollSnap();
        setCurrentSlide(selectedIndex);
        setProgressValue(0); // Reset progress when slide changes
        
        // Track view for the newly visible ad if not already tracked
        const adId = productBannerAds[selectedIndex].id;
        if (!trackedAds.has(adId)) {
          incrementAdView(adId);
          setTrackedAds(prev => {
            const newSet = new Set(prev);
            newSet.add(adId);
            return newSet;
          });
        }
      });
    }
  }, [api, productBannerAds.length, trackedAds]);

  // Auto-scroll implementation
  useEffect(() => {
    if (!productBannerAds.length || isHovered || isLoading) return;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    const autoSlide = () => {
      const duration = 5000; // 5 seconds per slide
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
          if (api) {
            api.scrollNext();
          }
          // Reset and start again
          elapsed = 0;
          timerRef.current = setTimeout(updateProgress, interval);
        }
      };
      
      timerRef.current = setTimeout(updateProgress, interval);
    };
    
    autoSlide();
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentSlide, api, isHovered, isLoading, productBannerAds.length]);

  // Handle banner click
  const handleBannerClick = (adId: string, referenceId: string) => {
    incrementAdClick(adId);
    navigate(`/products/${referenceId}`);
  };

  return (
    <div 
      className="w-full relative mb-8"
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
          {productBannerAds.map((ad) => (
            <CarouselItem key={ad.id} className="!pl-0 cursor-pointer" onClick={() => handleBannerClick(ad.id, ad.reference_id)}>
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
                      {ad.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 max-w-lg line-clamp-2">
                      {ad.description}
                    </p>
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
      {productBannerAds.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {productBannerAds.map((_, index) => (
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
}
