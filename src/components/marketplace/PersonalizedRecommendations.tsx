
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/ProductCard';
import { useEffect, useState } from 'react';
import { LightbulbIcon } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

export const PersonalizedRecommendations = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<any>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const { user, isLoading: authLoading } = useCurrentUser();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['personalized-recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
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
        .eq('user_id', user.id)
        .eq('endpoint', 'product_view')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (viewedProducts && viewedProducts.length > 0) {
        const productIds = viewedProducts
          .map(view => {
            // Handle metadata properly based on its type
            const metadata = view.metadata;
            if (typeof metadata === 'object' && metadata !== null && 'product_id' in metadata) {
              return metadata.product_id;
            }
            return null;
          })
          .filter(Boolean);
        
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
  
  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!api || !autoScrollEnabled || !products || products.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5500); // Different timing from other carousels
    
    return () => clearInterval(interval);
  }, [api, autoScrollEnabled, products]);
  
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
      
      <Carousel 
        className="w-full" 
        setApi={setApi}
        onMouseEnter={() => setAutoScrollEnabled(false)}
        onMouseLeave={() => setAutoScrollEnabled(true)}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </Carousel>
    </div>
  );
};
