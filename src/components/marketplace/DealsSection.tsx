
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "../products/ProductCard";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const DealsSection = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['deals-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_purchases(id)')
        .eq('is_discounted', true)
        .order('discount_percentage', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    }
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
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
    return <div className="text-center text-muted-foreground">No deals available</div>;
  }
  
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:flex justify-end gap-2 mt-2">
        <CarouselPrevious className="static translate-y-0 bg-blue-600 text-white hover:bg-blue-700 hover:text-white" />
        <CarouselNext className="static translate-y-0 bg-blue-600 text-white hover:bg-blue-700 hover:text-white" />
      </div>
    </Carousel>
  );
};
