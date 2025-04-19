
import { useEffect, useState } from "react";
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

// Sample banner data
const sampleBannerAds = [
  {
    id: "1",
    title: "Sleek. Slim. Stunning.",
    subTitle: "Up to 40% Off",
    description: "Next-gen BLDC fans. 10% Instant Discount on Credit Card & EMI Transactions.",
    image_url: "/lovable-uploads/12636902-1db2-447d-9b74-6dff044c196e.png",
    link: "/product/fan-collection",
    type: "product",
    reference_id: "fan-collection",
  },
  {
    id: "2",
    title: "Summer Fashion Sale",
    subTitle: "50% Off",
    description: "Upgrade your wardrobe with the latest summer collection.",
    image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
    link: "/businesses/fashion-hub",
    type: "business",
    reference_id: "summer-collection",
  },
  {
    id: "3",
    title: "Premium Electronics",
    subTitle: "Save Big",
    description: "Latest gadgets and electronics at unbeatable prices.",
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1901&auto=format&fit=crop",
    link: "/product/electronics-sale",
    type: "product",
    reference_id: "electronics-sale",
  }
];

export const BannerCarousel = () => {
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Handle slide changes
  useEffect(() => {
    if (!sampleBannerAds.length) return;
    
    if (api) {
      api.on("select", () => {
        setCurrentSlide(api.selectedScrollSnap());
        setProgressValue(0); // Reset progress when slide changes
      });
    }
  }, [api]);

  // Auto-scroll implementation with 3-second interval 
  useEffect(() => {
    if (!sampleBannerAds.length || isHovered) return;
    
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
          setCurrentSlide((prev) => (prev + 1) % sampleBannerAds.length);
        }
        startTime = 0; // Reset start time for next slide
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [sampleBannerAds.length, currentSlide, api, isHovered]);

  // Handle banner click to navigate to appropriate page
  const handleBannerClick = (ad: any) => {
    navigate(ad.link);
  };

  // Fallback content if no banner ads are available
  if (!sampleBannerAds.length) {
    return null;
  }

  return (
    <div 
      className="w-full relative mb-4"
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
        <CarouselContent>
          {sampleBannerAds.map((ad) => (
            <CarouselItem key={ad.id} className="cursor-pointer" onClick={() => handleBannerClick(ad)}>
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={ad.image_url} 
                    alt={ad.title}
                    className="w-full aspect-[21/9] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                    <div className="p-4 sm:p-8 md:p-12 w-full max-w-xl">
                      <div className="text-base sm:text-lg text-white mb-1">{ad.title}</div>
                      <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2">
                        {ad.subTitle}
                      </div>
                      <div className="text-xs sm:text-sm text-white/80 max-w-md">
                        {ad.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 border border-white/40 bg-black/30 hover:bg-black/50">
          <ChevronLeft className="h-4 w-4 text-white" />
        </CarouselPrevious>
        
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 border border-white/40 bg-black/30 hover:bg-black/50">
          <ChevronRight className="h-4 w-4 text-white" />
        </CarouselNext>
      </Carousel>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <Progress value={progressValue} className="h-1 rounded-none bg-gray-200/50" indicatorClassName="bg-primary" />
      </div>
      
      {/* Pagination dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {sampleBannerAds.map((_, index) => (
          <div 
            key={index} 
            className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
              index === currentSlide ? 'bg-white scale-100' : 'bg-white/50 scale-75'
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};
