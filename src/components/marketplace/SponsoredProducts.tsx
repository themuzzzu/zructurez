
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2 } from "lucide-react";
import { GridLayoutType, ProductType } from "@/components/products/types/ProductTypes";

interface SponsoredProductsProps {
  gridLayout?: GridLayoutType;
}

export const SponsoredProducts = ({ gridLayout = "grid4x4" }: SponsoredProductsProps) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

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
          .limit(4);
          
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

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sponsored Products</h2>
      </div>
      
      <div className={`grid gap-4 ${
        gridLayout === "grid4x4" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
        gridLayout === "grid2x2" ? "grid-cols-1 sm:grid-cols-2" :
        "grid-cols-1"
      }`}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            isSponsored
          />
        ))}
      </div>
    </div>
  );
};
