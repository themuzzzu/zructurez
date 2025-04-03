
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { RankingsTabs } from "./RankingsTabs";
import { Product } from "@/types/product";

export const ProductRankings = () => {
  const [rankingType, setRankingType] = useState<"views" | "wishlisted" | "sales">("views");
  
  const { data: topProducts, isLoading } = useQuery({
    queryKey: ['top-products', rankingType],
    queryFn: async () => {
      try {
        let query;
        
        switch (rankingType) {
          case "wishlisted":
            // Get products with most wishlists
            const { data: wishlistData, error: wishlistError } = await supabase
              .from('wishlists')
              .select('product_id, count(*)')
              .order('count', { ascending: false })
              .limit(8);
              
            if (wishlistError) throw wishlistError;
            
            // Get the product details
            const productIds = wishlistData?.map(item => item.product_id) || [];
            if (productIds.length === 0) return [];
            
            const { data: products, error } = await supabase
              .from('products')
              .select('*')
              .in('id', productIds);
              
            if (error) throw error;
            return products || [];
            
          case "sales":
            // Get products with most sales
            const { data: salesData, error: salesError } = await supabase
              .from('orders')
              .select('product_id, count(*)')
              .order('count', { ascending: false })
              .limit(8);
              
            if (salesError) throw salesError;
            
            // Get the product details
            const productIdsSales = salesData?.map(item => item.product_id) || [];
            if (productIdsSales.length === 0) return [];
            
            const { data: productsSales, error: productsSalesError } = await supabase
              .from('products')
              .select('*')
              .in('id', productIdsSales);
              
            if (productsSalesError) throw productsSalesError;
            return productsSales || [];
            
          case "views":
          default:
            // Get top products by views
            const { data, error: viewsError } = await supabase
              .from('products')
              .select('*')
              .order('views', { ascending: false })
              .limit(8);
              
            if (viewsError) throw viewsError;
            return data || [];
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = topProducts || [];

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
