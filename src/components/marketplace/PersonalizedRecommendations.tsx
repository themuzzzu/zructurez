
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/ProductCard';
import { useEffect, useState, useRef } from 'react';
import { LightbulbIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';

export const PersonalizedRecommendations = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  
  // Fix: The useCurrentUser hook returns a query result, so we need to access data
  const { data: profile, isLoading: authLoading } = useCurrentUser();
  
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
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['personalized-recommendations', profile?.id],
    queryFn: async () => {
      if (!profile?.id) {
        // Return popular products for non-logged in users
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('views', { ascending: false })
          .limit(8);
          
        if (error) throw error;
        return data;
      }
      
      // First try to get viewed products by this user
      const { data: viewedProducts } = await supabase
        .from('performance_metrics')
        .select('metadata')
        .eq('user_id', profile.id)
        .eq('endpoint', 'product_view')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (viewedProducts && viewedProducts.length > 0) {
        // Fix: Properly extract product_ids from metadata with type checking
        const productIds = viewedProducts
          .map(view => {
            // Handle metadata properly based on its type
            const metadata = view.metadata;
            if (typeof metadata === 'object' && metadata !== null && 'product_id' in metadata) {
              return metadata.product_id;
            }
            return null;
          })
          .filter(Boolean) as string[]; // Explicitly cast to string[] after filtering
        
        if (productIds.length > 0) {
          // Get categories of viewed products
          const { data: categories } = await supabase
            .from('products')
            .select('category')
            .in('id', productIds);
            
          if (categories && categories.length > 0) {
            const uniqueCategories = [...new Set(categories.map(p => p.category))];
            
            // Recommend other products from the same categories
            const { data: recommendedProducts } = await supabase
              .from('products')
              .select('*')
              .in('category', uniqueCategories)
              .not('id', 'in', productIds) // Exclude already viewed products
              .order('views', { ascending: false })
              .limit(8);
              
            if (recommendedProducts && recommendedProducts.length > 0) {
              return recommendedProducts;
            }
          }
        }
      }
      
      // Fallback to popular products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('views', { ascending: false })
        .limit(8);
        
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !authLoading // Only run when auth state is known
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-blue-500" />
          Suggested for You
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
        <LightbulbIcon className="h-5 w-5 text-blue-500" />
        Suggested for You
      </h3>
      
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
          onMouseEnter={() => setAutoScrollEnabled(false)}
          onMouseLeave={() => setAutoScrollEnabled(true)}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[250px] sm:min-w-[280px] w-[70vw] max-w-[320px] flex-shrink-0 snap-start">
              <div className="relative h-full">
                <ProductCard product={product} />
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
