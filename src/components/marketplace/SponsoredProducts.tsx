
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useState, useEffect, useRef } from "react";

interface SponsoredProductsProps {
  gridLayout?: GridLayoutType;
}

export const SponsoredProducts = ({ gridLayout = "grid4x4" }: SponsoredProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['sponsored-products'],
    queryFn: async () => {
      // In a real implementation, we would have a sponsored field in the products table
      // For this demo, we'll use brand to represent sponsored products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_branded', true)
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Check scroll position to show/hide arrows
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const checkScroll = () => {
      setShowLeftArrow(container.scrollLeft > 10);
      setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
    };
    
    // Initial check
    checkScroll();
    
    // Add scroll listener
    container.addEventListener('scroll', checkScroll);
    
    // Clean up
    return () => container.removeEventListener('scroll', checkScroll);
  }, [products]);
  
  // Handle horizontal scroll with buttons
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
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Sponsored Products
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
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Sponsored Products
        </h3>
      </div>
      
      <div className="relative group">
        {/* Left scroll button - only shown when needed */}
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
        
        {/* Scrollable container */}
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
                  layout={gridLayout}
                  sponsored={true}
                />
                <Badge 
                  className="absolute top-2 right-2 bg-yellow-500/90 text-white text-xs"
                  variant="secondary"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Sponsored
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right scroll button - only shown when needed */}
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
    </div>
  );
};
