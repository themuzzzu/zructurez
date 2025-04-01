
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useNavigate } from "react-router-dom";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface TrendingProductsProps {
  gridLayout?: GridLayoutType;
}

export const TrendingProducts = ({ gridLayout = "grid4x4" }: TrendingProductsProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Sponsored Products
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
    <div className="space-y-4 mb-8 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Sponsored Products
        </h3>
      </div>
      
      <div className="relative group">
        {/* Left scroll button */}
        <Button 
          onClick={() => scroll('left')}
          size="icon"
          variant="ghost" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-md hidden md:flex"
        >
          <ChevronLeft />
        </Button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 pb-2 pt-1 px-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] flex-shrink-0 snap-start">
              <div className="relative h-full">
                <ProductCard 
                  product={product}
                  layout={gridLayout}
                />
                {product.sales_count > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {product.sales_count}+ bought
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <Button 
          onClick={() => scroll('right')}
          size="icon"
          variant="ghost" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-md hidden md:flex"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
