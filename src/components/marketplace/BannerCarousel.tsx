
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

// Sample banner ad data for demonstration
const sampleBannerAds: Advertisement[] = [
  {
    id: "1",
    title: "Orient Electric Cooling Days",
    description: "Sleek. Slim. Stunning. Up to 40% Off. Next-gen BLDC fans. 10% Instant Discount on Credit Card & EMI Transactions.",
    image_url: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png",
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
    image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1901&auto=format&fit=crop",
    business_id: "tech-world",
    type: "product",
    reference_id: "electronics-sale",
    budget: 4000,
    format: "banner",
    status: "active"
  },
  {
    id: "4",
    title: "Luxury Home Decor",
    description: "Transform your living space with our premium home decor items. Use code HOME30 for 30% off.",
    image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop",
    business_id: "home-luxe",
    type: "product",
    reference_id: "home-collection",
    budget: 3000,
    format: "banner",
    status: "active"
  },
  {
    id: "5",
    title: "Fitness Gear Sale",
    description: "Get fit with premium fitness equipment. Buy one get one free on selected items.",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    business_id: "fitness-pro",
    type: "service",
    reference_id: "fitness-program",
    budget: 2500,
    format: "banner",
    status: "active"
  },
  {
    id: "6",
    title: "Gourmet Food Festival",
    description: "Experience the taste of luxury. Special offers on gourmet food items.",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    business_id: "food-delight",
    type: "business",
    reference_id: "food-festival",
    budget: 2000,
    format: "banner",
    status: "active"
  },
  {
    id: "7",
    title: "Travel Adventures",
    description: "Explore exotic destinations with our special travel packages. Book now and save 20%.",
    image_url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974&auto=format&fit=crop",
    business_id: "travel-escape",
    type: "service",
    reference_id: "travel-packages",
    budget: 4500,
    format: "banner",
    status: "active"
  },
  {
    id: "8",
    title: "Beauty Products Sale",
    description: "Reveal your natural beauty with our premium beauty products. Up to 40% off this week only.",
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop",
    business_id: "beauty-hub",
    type: "product",
    reference_id: "beauty-collection",
    budget: 3000,
    format: "banner",
    status: "active"
  },
  {
    id: "9",
    title: "Jewelry Collection",
    description: "Adorn yourself with our exquisite jewelry collection. Special launch prices for limited time.",
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1984&auto=format&fit=crop",
    business_id: "jewelry-box",
    type: "product",
    reference_id: "jewelry-sale",
    budget: 5500,
    format: "banner",
    status: "active"
  },
  {
    id: "10",
    title: "Book Fair",
    description: "Expand your knowledge with our vast collection of books. Buy 2 get 1 free on all items.",
    image_url: "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=2071&auto=format&fit=crop",
    business_id: "book-haven",
    type: "business",
    reference_id: "book-fair",
    budget: 2000,
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

  // Use the sample banner ads instead of fetching from API for now
  const bannerAds = sampleBannerAds;

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
    if (!bannerAds.length || isHovered) return;
    
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
  }, [bannerAds.length, currentSlide, api, isHovered]);

  // Handle banner click to navigate to appropriate page
  const handleBannerClick = (ad: Advertisement) => {
    if (ad.type === "product") {
      navigate(`/product/${ad.reference_id}`);
    } else if (ad.type === "business") {
      navigate(`/businesses/${ad.reference_id}`);
    } else if (ad.type === "service") {
      navigate(`/services/${ad.reference_id}`);
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
                {ad.image_url ? (
                  <div className="relative">
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-full object-cover aspect-[16/9] rounded-lg"
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
                ) : (
                  <div className="aspect-[16/9] rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-6 flex items-center">
                    <div className="max-w-xl">
                      <h2 className="text-xl sm:text-3xl font-bold mb-2">{ad.title}</h2>
                      <p className="text-white/80 text-sm sm:text-lg mb-4 sm:mb-6">{ad.description}</p>
                    </div>
                  </div>
                )}
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
