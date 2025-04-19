
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

const SuggestedProducts = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const { data: products, isLoading } = useQuery({
    queryKey: ['suggested-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('views', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data as Product[];
    },
  });

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-primary" />
          Suggested For You
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="relative">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <ThumbsUp className="h-5 w-5 text-primary" />
        Suggested For You
      </h2>

      <div className="relative group">
        {showLeftScroll && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm border"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          onScroll={checkScroll}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[250px]">
              <ProductCard
                product={product}
                layout="grid1x1"
              />
            </div>
          ))}
        </div>

        {showRightScroll && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm border"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuggestedProducts;
