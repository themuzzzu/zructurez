
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { RankingsTabs } from "./RankingsTabs";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { TrendingUp, Heart, ShoppingBag } from "lucide-react";

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
              .select('product_id, count(*) as wishlist_count')
              .group('product_id')
              .order('wishlist_count', { ascending: false })
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
            
            // Sort according to wishlist count
            const sortedProducts = productIds.map(id => 
              products?.find(product => product.id === id)
            ).filter(Boolean);
            
            return sortedProducts || [];
            
          case "sales":
            // Get products with most sales
            const { data: salesData, error: salesError } = await supabase
              .from('product_purchases')
              .select('product_id, count(*) as purchase_count')
              .group('product_id')
              .order('purchase_count', { ascending: false })
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
            
            // Sort according to sales count
            const sortedSalesProducts = productIdsSales.map(id => 
              productsSales?.find(product => product.id === id)
            ).filter(Boolean);
            
            return sortedSalesProducts || [];
            
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
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for more "real-time" feel
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Product Rankings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

  const products = topProducts || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold">Product Rankings</h2>
        <div className="flex gap-2">
          <div 
            className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full ${
              rankingType === "views" 
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setRankingType("views")}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Most Viewed</span>
          </div>
          
          <div 
            className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full ${
              rankingType === "wishlisted" 
                ? "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setRankingType("wishlisted")}
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm">Most Wishlisted</span>
          </div>
          
          <div 
            className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full ${
              rankingType === "sales" 
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setRankingType("sales")}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm">Top Selling</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} layout="grid4x4" />
            <div className="absolute top-2 right-2 bg-black/70 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
