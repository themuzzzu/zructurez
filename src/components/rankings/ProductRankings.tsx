
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { RankingsTabs } from "./RankingsTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const ProductRankings = () => {
  const { data: topViewedProducts, isLoading: isLoadingViewed } = useQuery({
    queryKey: ['top-viewed-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('views', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: topWishlistedProducts, isLoading: isLoadingWishlisted } = useQuery({
    queryKey: ['top-wishlisted-products'],
    queryFn: async () => {
      // Get products with the most entries in the wishlists table
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id, count(*)')
        .groupBy('product_id')
        .order('count', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // Fetch the actual product details
      const productIds = data.map(item => item.product_id);
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
        
      if (productsError) throw productsError;
      
      // Sort the products to match the original order
      const sortedProducts = productIds.map(id => 
        products?.find(product => product.id === id)
      ).filter(Boolean);
      
      return sortedProducts || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = isLoadingViewed || isLoadingWishlisted;

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Rankings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

  const products = topViewedProducts || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <RankingsTabs
      type="products"
      items={products}
      renderItem={(product, index) => (
        <ProductCard
          product={{
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            image_url: product.image_url,
            category: product.category,
            views: product.views,
            stock: product.stock,
            is_discounted: product.is_discounted,
            discount_percentage: product.discount_percentage,
            original_price: product.original_price
          }}
          layout="grid1x1"
        />
      )}
    />
  );
};
