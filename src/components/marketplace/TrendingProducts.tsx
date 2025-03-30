
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface TrendingProductsProps {
  gridLayout?: GridLayoutType;
}

export const TrendingProducts = ({ gridLayout = "grid4x4" }: TrendingProductsProps) => {
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['trending-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_purchases(id)')
        .order('views', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      
      // Calculate trending score
      return data.map(product => {
        const salesCount = Array.isArray(product.product_purchases) 
          ? product.product_purchases.length 
          : 0;
        
        return {
          ...product,
          sales_count: salesCount,
          trending_score: (product.views * 0.3) + (salesCount * 0.7)
        };
      }).sort((a, b) => b.trending_score - a.trending_score);
    }
  });
  
  // Generate responsive grid classes based on layout
  const getGridClasses = () => {
    switch (gridLayout) {
      case "grid4x4":
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4";
      case "grid2x2":
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4";
      case "grid1x1":
        return "flex flex-col gap-3";
      default:
        return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };
  
  if (isLoading) {
    return (
      <div className={getGridClasses()}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className={gridLayout === "grid1x1" ? "h-24 w-full" : "h-48 w-full"} />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return <div className="text-center text-muted-foreground">No trending products found</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Trending Now</h3>
      </div>
      
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout={gridLayout} />
        ))}
      </div>
    </div>
  );
};
