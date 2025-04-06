import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

export const CrazyDeals = () => {
  const [api, setApi] = useState<any>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['crazy-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_discounted', true)
        .gt('discount_percentage', 40)
        .order('discount_percentage', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data || [];
    }
  });
  
  useEffect(() => {
    if (!api || !autoScrollEnabled || !products || products.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4500);
    
    return () => clearInterval(interval);
  }, [api, autoScrollEnabled, products]);
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Crazy Deals
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-amber-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            CRAZY DEALS
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Massive discounts up to 70% off! Limited time offers.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-blue-600"
          onClick={() => navigate('/marketplace?filter=discounted')}
        >
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-amber-100 to-transparent opacity-50 z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-amber-100 to-transparent opacity-50 z-10"></div>
        
        <Carousel 
          className="w-full" 
          setApi={setApi}
          onMouseEnter={() => setAutoScrollEnabled(false)}
          onMouseLeave={() => setAutoScrollEnabled(true)}
          opts={{
            loop: true,
            align: "start"
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="relative">
                  <ProductCard 
                    key={product.id}
                    product={product} 
                    layout="grid3x3"
                    sponsored={true}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
          <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        </Carousel>
      </div>
    </div>
  );
};
