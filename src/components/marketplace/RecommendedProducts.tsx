
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { ThumbsUp } from "lucide-react";

// Define the GridLayoutType at the module level to avoid recursive type references
type GridLayoutType = "grid4x4" | "grid2x2" | "grid1x1";

interface RecommendedProductsProps {
  gridLayout?: GridLayoutType;
}

export const RecommendedProducts = ({ gridLayout = "grid4x4" }: RecommendedProductsProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['recommended-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8);
      
      if (error) throw error;
      return data;
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
    return <div className="text-center text-muted-foreground">No recommended products found</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ThumbsUp className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">Recommended For You</h3>
      </div>
      
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout={gridLayout} />
        ))}
      </div>
    </div>
  );
};
