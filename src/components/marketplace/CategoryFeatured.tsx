
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface CategoryFeaturedProps {
  categoryName: string;
  limit?: number;
}

export const CategoryFeatured = ({ categoryName, limit = 6 }: CategoryFeaturedProps) => {
  const navigate = useNavigate();
  const [api, setApi] = useState<any>(null);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['category-featured', categoryName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName)
        .order('views', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  const handleViewAll = () => {
    navigate(`/marketplace?category=${encodeURIComponent(categoryName)}`);
  };
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured in {categoryName}</h2>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-36 w-full" />
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
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Featured in {categoryName}</h2>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={handleViewAll}
        >
          View All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
        <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
      </Carousel>
    </div>
  );
};
