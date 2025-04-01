
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

export const FlashSale = () => {
  const [remainingTime, setRemainingTime] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });
  const [api, setApi] = useState<any>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['flash-sale-products'],
    queryFn: async () => {
      // In a real app, you'd have a flash_sale table with active sales
      // For demo purposes, we're using products with the highest discounts
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_discounted', true)
        .gt('discount_percentage', 30) // Only products with >30% discount
        .order('discount_percentage', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
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
        return { hours: 1, minutes: 59, seconds: 59 };
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
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Flash Sale
          </h2>
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8">
      <div className="bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-white animate-pulse" />
            Flash Sale
          </h2>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 text-white">
            <span className="text-xl font-mono font-bold">
              {formatTime(remainingTime.hours)}:{formatTime(remainingTime.minutes)}:{formatTime(remainingTime.seconds)}
            </span>
          </div>
        </div>
      </div>
      
      <Carousel
        className="w-full"
        setApi={setApi}
        onMouseEnter={() => setAutoScrollEnabled(false)}
        onMouseLeave={() => setAutoScrollEnabled(true)}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
              <div className="relative">
                <ProductCard product={product} />
                <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">
                  FLASH DEAL
                </Badge>
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                  {product.discount_percentage}% OFF
                </Badge>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </Carousel>
    </div>
  );
};
