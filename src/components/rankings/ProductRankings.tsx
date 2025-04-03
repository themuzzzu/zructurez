
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { RankingsTabs } from "./RankingsTabs";
import { Product } from "@/types/product";

export const ProductRankings = () => {
  const { data: topViewedProducts, isLoading } = useQuery({
    queryKey: ['top-viewed-products'],
    queryFn: async () => {
      try {
        // Get top products by views
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('views', { ascending: false })
          .limit(8);
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching top products:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = topViewedProducts || [];

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <RankingsTabs
      type="products"
      items={products}
      renderItem={(product: Product) => (
        <ProductCard
          product={product}
          layout="grid4x4"
        />
      )}
    />
  );
};
