
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface TrendingProductsProps {
  gridLayout?: GridLayoutType;
}

export const TrendingProducts = ({ gridLayout = "grid4x4" }: TrendingProductsProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<any>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_purchases(id)')
        .order('views', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      
      // Calculate trending score
      return data.map(product => {
        const salesCount = Array.isArray(product.product_purchases) 
          ? product.product_purchases.length 
          : 0;
        
        return {
          ...product,
          sales_count: salesCount,
          trending_score: (product.views * 0.3) + (salesCount * 0.7)
        };
      }).sort((a, b) => b.trending_score - a.trending_score);
    }
  });

  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!api || !autoScrollEnabled || !products || products.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4500); // Different timing from sponsored products
    
    return () => clearInterval(interval);
  }, [api, autoScrollEnabled, products]);
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Trending Now
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-500" />
        Trending Now
      </h3>
      
      <Carousel 
        className="w-full" 
        setApi={setApi}
        onMouseEnter={() => setAutoScrollEnabled(false)}
        onMouseLeave={() => setAutoScrollEnabled(true)}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard 
                product={product}
                layout={gridLayout}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </Carousel>
    </div>
  );
};
