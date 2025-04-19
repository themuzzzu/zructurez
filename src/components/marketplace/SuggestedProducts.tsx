
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const SuggestedProducts = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['suggested-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const checkScroll = () => {
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
    };
    
    checkScroll();
    
    container.addEventListener('scroll', checkScroll);
    
    return () => container.removeEventListener('scroll', checkScroll);
  }, [products]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-4">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 px-1">
          <Brain className="h-5 w-5 text-blue-500" />
          Suggested for You
        </h3>
        <div className="flex overflow-x-auto gap-3 pb-2 pt-1 px-1 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[160px] sm:min-w-[220px] flex-shrink-0">
              <Card className="overflow-hidden h-full">
                <Skeleton className="h-48 w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-4 relative">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          Suggested for You
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/products?section=suggested')}
          className="gap-1"
        >
          See All
        </Button>
      </div>
      
      <div className="relative group">
        {showLeftArrow && (
          <Button 
            onClick={() => scroll('left')}
            size="icon"
            variant="ghost" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-md hidden md:flex"
          >
            <ChevronLeft />
          </Button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 pb-2 pt-1 px-1 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] sm:min-w-[220px] md:min-w-[250px] w-[40vw] sm:w-[35vw] md:w-[30vw] lg:w-[25vw] max-w-[320px] flex-shrink-0 snap-start">
              <div className="relative h-full">
                <ProductCard 
                  product={product}
                  layout="grid4x4"
                />
                <Badge 
                  className="absolute top-2 right-2 bg-blue-500/90 text-white text-xs"
                  variant="secondary"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  For You
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <Button 
            onClick={() => scroll('right')}
            size="icon"
            variant="ghost" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-md hidden md:flex"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground italic text-center">
        Recommendations based on your browsing history and preferences
      </p>
    </div>
  );
};
