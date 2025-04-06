
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { TrendingUp, Heart, ShoppingBag, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ProductRankings = () => {
  const [rankingType, setRankingType] = useState<"views" | "wishlisted" | "sales">("views");
  
  const { data: topProducts, isLoading } = useQuery({
    queryKey: ['top-products', rankingType],
    queryFn: async () => {
      try {
        let productsData: any[] = [];
        
        switch (rankingType) {
          case "wishlisted":
            // First get all wishlisted product entries
            const { data: wishlistEntries, error: wishlistError } = await supabase
              .from('wishlists')
              .select('product_id');
              
            if (wishlistError) throw wishlistError;
            
            // Count occurrences of each product_id
            const wishlistCounts: Record<string, number> = {};
            wishlistEntries?.forEach(entry => {
              if (entry.product_id) {
                wishlistCounts[entry.product_id] = (wishlistCounts[entry.product_id] || 0) + 1;
              }
            });
            
            // Sort product IDs by wishlist count
            const sortedProductIds = Object.keys(wishlistCounts).sort(
              (a, b) => wishlistCounts[b] - wishlistCounts[a]
            ).slice(0, 8); // Limit to top 8
            
            if (sortedProductIds.length === 0) return [];
            
            // Get the actual product details
            const { data: products, error } = await supabase
              .from('products')
              .select('*')
              .in('id', sortedProductIds);
              
            if (error) throw error;
            
            // Sort products according to wishlist count and add count to each product
            productsData = sortedProductIds
              .map(id => {
                const product = products?.find(p => p.id === id);
                return product ? {
                  ...product,
                  count: wishlistCounts[id]
                } : null;
              })
              .filter(Boolean) as any[];
            
            return productsData || [];
            
          case "sales":
            // First get all purchased products
            const { data: purchaseEntries, error: salesError } = await supabase
              .from('product_purchases')
              .select('product_id, quantity');
              
            if (salesError) throw salesError;
            
            // Count total quantity sold for each product
            const salesCounts: Record<string, number> = {};
            purchaseEntries?.forEach(entry => {
              if (entry.product_id) {
                salesCounts[entry.product_id] = (salesCounts[entry.product_id] || 0) + (entry.quantity || 1);
              }
            });
            
            // Sort product IDs by sales count
            const sortedSalesIds = Object.keys(salesCounts).sort(
              (a, b) => salesCounts[b] - salesCounts[a]
            ).slice(0, 8); // Limit to top 8
            
            if (sortedSalesIds.length === 0) return [];
            
            // Get the actual product details
            const { data: salesProducts, error: productsSalesError } = await supabase
              .from('products')
              .select('*')
              .in('id', sortedSalesIds);
              
            if (productsSalesError) throw productsSalesError;
            
            // Sort products according to sales count and add count to each product
            productsData = sortedSalesIds
              .map(id => {
                const product = salesProducts?.find(p => p.id === id);
                return product ? {
                  ...product,
                  count: salesCounts[id]
                } : null;
              })
              .filter(Boolean) as any[];
            
            return productsData || [];
            
          case "views":
          default:
            // Get top products by views
            const { data, error: viewsError } = await supabase
              .from('products')
              .select('*')
              .order('views', { ascending: false })
              .limit(8);
              
            if (viewsError) throw viewsError;
            
            // Add count (views) to each product
            return data?.map(product => ({
              ...product,
              count: product.views || 0
            })) || [];
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-36 w-full" />
              <div className="p-2">
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

  const renderCountLabel = (count: number) => {
    switch (rankingType) {
      case "wishlisted":
        return `${count} ${count === 1 ? 'wishlist' : 'wishlists'}`;
      case "sales":
        return `${count} sold`;
      case "views":
        return `${count} ${count === 1 ? 'view' : 'views'}`;
      default:
        return "";
    }
  };

  const getIconForType = () => {
    switch (rankingType) {
      case "wishlisted":
        return <Heart className="h-4 w-4 mr-1" />;
      case "sales":
        return <ShoppingBag className="h-4 w-4 mr-1" />;
      case "views":
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold">Product Rankings</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            className={cn(
              "cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors",
              rankingType === "views" 
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            )}
            onClick={() => setRankingType("views")}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">Most Viewed</span>
          </button>
          
          <button 
            className={cn(
              "cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors",
              rankingType === "wishlisted" 
                ? "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            )}
            onClick={() => setRankingType("wishlisted")}
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">Most Wishlisted</span>
          </button>
          
          <button 
            className={cn(
              "cursor-pointer flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors",
              rankingType === "sales" 
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            )}
            onClick={() => setRankingType("sales")}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">Top Selling</span>
          </button>
        </div>
      </div>
      
      {/* Mobile scrollable view */}
      <div className="block md:hidden">
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex gap-3 px-1 pb-2">
            {products.map((product, index) => (
              <div key={product.id} className="relative w-36 flex-shrink-0">
                <ProductCard product={product} layout="grid4x4" />
                <div className="absolute top-2 left-2 bg-black/70 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm z-10">
                  {index + 1}
                </div>
                <div className="absolute bottom-12 left-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded flex items-center justify-center">
                  {getIconForType()}
                  <span>{renderCountLabel(product.count || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Desktop grid view */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((product, index) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} layout="grid4x4" />
            <div className="absolute top-2 left-2 bg-black/70 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm z-10">
              {index + 1}
            </div>
            <div className="absolute bottom-12 left-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded flex items-center justify-center">
              {getIconForType()}
              <span>{renderCountLabel(product.count || 0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
