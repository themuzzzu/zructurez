
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";

// Define the GridLayoutType at the module level to avoid recursive type references
type GridLayoutType = "grid4x4" | "grid2x2" | "grid1x1";

interface SponsoredProductsProps {
  gridLayout?: GridLayoutType;
}

export const SponsoredProducts = ({ gridLayout = "grid4x4" }: SponsoredProductsProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['sponsored-products'],
    queryFn: async () => {
      // In a real application, you would fetch sponsored products
      // This is a placeholder implementation
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(4);
      
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
        {[...Array(4)].map((_, i) => (
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
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Megaphone className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Sponsored</h3>
        <Badge variant="outline" className="ml-2 text-xs">Ad</Badge>
      </div>
      
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            layout={gridLayout}
            sponsored={true}
          />
        ))}
      </div>
    </div>
  );
};
