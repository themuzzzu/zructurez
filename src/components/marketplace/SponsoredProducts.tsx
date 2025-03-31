
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2, Sparkles } from "lucide-react";
import { GridLayoutType, ProductType } from "@/components/products/types/ProductTypes";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface SponsoredProductsProps {
  gridLayout?: GridLayoutType;
}

export const SponsoredProducts = ({ gridLayout = "grid4x4" }: SponsoredProductsProps) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [api, setApi] = useState<any>(null);

  // Increment view counter for sponsored products
  const { mutate: incrementAdView } = useMutation({
    mutationFn: async (adId: string) => {
      try {
        // Call Supabase function to increment ad views
        const { error } = await supabase.rpc('increment_ad_views', { ad_id: adId });
        if (error) throw error;
      } catch (error) {
        console.error('Error incrementing ad view:', error);
      }
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch sponsored products based on ads that reference products
        const { data: ads, error: adsError } = await supabase
          .from('advertisements')
          .select('*')
          .eq('type', 'product')
          .eq('status', 'active')
          .order('reach', { ascending: false })
          .limit(8);
          
        if (adsError) throw adsError;
        
        if (ads && ads.length > 0) {
          // Extract product IDs from ads
          const productIds = ads.map(ad => ad.reference_id);
          
          // Fetch actual products
          const { data: productData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);
            
          if (productsError) throw productsError;
          
          // Record view impressions for each ad
          ads.forEach(ad => {
            incrementAdView(ad.id);
          });
          
          setProducts(productData || []);
        }
      } catch (error) {
        console.error('Error loading sponsored products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [incrementAdView]);

  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!api || !autoScrollEnabled || products.length <= 1) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [api, autoScrollEnabled, products.length]);

  if (loading) {
    return (
      <div className="py-6">
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Sponsored Products
        </h2>
      </div>
      
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
                sponsored={true}
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
