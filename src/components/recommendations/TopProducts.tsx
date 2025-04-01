
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { useRef } from "react";

interface TopProductsProps {
  category?: string;
  limit?: number;
  title?: string;
  showTitle?: boolean;
}

export const TopProducts = ({
  category,
  limit = 4,
  title = "Top Products",
  showTitle = true
}: TopProductsProps) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['top-products', category, limit],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Get top products by views
      query = query.order('views', { ascending: false });
      
      const { data, error } = await query.limit(limit);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
  
  // Track impressions
  const trackImpression = async (productId: string) => {
    try {
      // In a real app, this would connect to an analytics service
      // For demo purposes, we'll just increment views
      await supabase.rpc('increment_product_views', { product_id_param: productId });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-500" /> 
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8 relative">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" /> 
            {title}
          </h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/marketplace')}
            className="gap-1"
          >
            View all
            <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
      
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
            <div key={product.id} className="min-w-[250px] sm:min-w-[280px] w-[70vw] max-w-[320px] flex-shrink-0 snap-start" onMouseEnter={() => trackImpression(product.id)}>
              <div className="relative h-full">
                <ProductCard product={product} />
                <Badge 
                  className="absolute top-2 right-2 bg-blue-500/90 text-xs"
                  variant="secondary"
                >
                  Top Rated
                </Badge>
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
}
