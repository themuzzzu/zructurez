
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

export const FlashDeals = () => {
  const [remainingTime, setRemainingTime] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0
  });
  const [api, setApi] = useState<any>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['flash-deals-products'],
    queryFn: async () => {
      try {
        // In a real app, you'd have a flash_sale table with active sales
        // For demo purposes, we're using products with the highest discounts
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_discounted', true)
          .gt('discount_percentage', 40) // Only products with >40% discount
          .order('discount_percentage', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching flash deals:", err);
        // Return mock data as fallback
        return getMockFlashDeals();
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        
        if (newSeconds >= 0) {
          return { ...prevTime, seconds: newSeconds };
        }
        
        const newMinutes = prevTime.minutes - 1;
        if (newMinutes >= 0) {
          return { ...prevTime, minutes: newMinutes, seconds: 59 };
        }
        
        const newHours = prevTime.hours - 1;
        if (newHours >= 0) {
          return { hours: newHours, minutes: 59, seconds: 59 };
        }
        
        // Reset timer for demo purposes
        return { hours: 1, minutes: 30, seconds: 0 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!api || !autoScrollEnabled || !products || products.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, autoScrollEnabled, products]);
  
  // Format time with leading zeros
  const formatTime = (value: number) => value.toString().padStart(2, '0');
  
  // Generate mock flash deals data
  const getMockFlashDeals = () => {
    return Array(6).fill(null).map((_, index) => ({
      id: `flash-${index}`,
      title: `Flash Deal Product ${index + 1}`,
      description: "Limited time offer! Get it before it's gone.",
      price: Math.floor(Math.random() * 100) + 50,
      original_price: Math.floor(Math.random() * 200) + 100,
      discount_percentage: Math.floor(Math.random() * 30) + 40, // 40-70%
      image_url: `https://picsum.photos/seed/flash${index}/300/300`,
      category: ['electronics', 'fashion', 'home', 'beauty'][Math.floor(Math.random() * 4)],
      is_discounted: true,
      rating: (Math.random() * 2) + 3, // 3-5 rating
      rating_count: Math.floor(Math.random() * 100) + 10,
      created_at: new Date().toISOString()
    }));
  };
  
  if (isLoading) {
    return (
      <div className="bg-black dark:bg-zinc-950 rounded-lg p-2 sm:p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            Flash Deals
          </h2>
          <Skeleton className="h-6 w-24 bg-gray-800" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1b2430] rounded-lg overflow-hidden">
              <Skeleton className="h-24 sm:h-28 w-full bg-gray-800" />
              <div className="p-2">
                <Skeleton className="h-3 w-3/4 mb-1 bg-gray-800" />
                <Skeleton className="h-3 w-1/2 bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !products || products.length === 0) {
    console.error("Flash deals error or no data:", error);
    return null;
  }
  
  return (
    <div className="bg-black dark:bg-zinc-950 rounded-lg p-2 sm:p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
          Flash Deals
        </h3>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 text-white text-xs sm:text-sm">
          <span className="font-mono">
            {formatTime(remainingTime.hours)}:{formatTime(remainingTime.minutes)}:{formatTime(remainingTime.seconds)}
          </span>
        </div>
      </div>
      
      <Carousel
        className="w-full"
        setApi={setApi}
        onMouseEnter={() => setAutoScrollEnabled(false)}
        onMouseLeave={() => setAutoScrollEnabled(true)}
      >
        <CarouselContent className="-ml-1 sm:-ml-2">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-1 sm:pl-2 basis-1/2 sm:basis-1/3 md:basis-1/3">
              <div className="relative">
                <ProductCard product={product} />
                <Badge className="absolute top-1 left-1 bg-red-500 text-white animate-pulse text-xs">
                  FLASH DEAL
                </Badge>
                <Badge className="absolute top-1 right-1 bg-yellow-500 text-black text-xs">
                  {product.discount_percentage}% OFF
                </Badge>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden sm:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 !w-7 !h-7" />
        <CarouselNext className="hidden sm:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 !w-7 !h-7" />
      </Carousel>
    </div>
  );
};

export default FlashDeals;
