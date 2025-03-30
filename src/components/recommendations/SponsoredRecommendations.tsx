
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GridLayoutType } from "@/components/products/types/ProductTypes";

interface SponsoredRecommendationsProps {
  category?: string;
  limit?: number;
  title?: string;
  showTitle?: boolean;
}

export const SponsoredRecommendations = ({
  category,
  limit = 4,
  title = "Sponsored Recommendations",
  showTitle = true
}: SponsoredRecommendationsProps) => {
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['sponsored-recommendations', category, limit],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // In a real implementation, we would have a sponsored field or join with ads table
      // For now, we'll use branded products as a proxy for sponsored
      query = query.eq('is_branded', true);
      
      const { data, error } = await query.limit(limit);
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Track impressions
  const trackImpression = async (productId: string) => {
    try {
      // In a real app, this would connect to an analytics service
      // For demo purposes, we'll just increment views
      await supabase.rpc('increment_product_views', { product_id_param: productId });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" /> 
              {title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/marketplace')}
            >
              View all
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative" onMouseEnter={() => trackImpression(product.id)}>
              <ProductCard product={product} />
              <Badge 
                className="absolute top-2 right-2 bg-yellow-500/90 text-xs"
                variant="secondary"
              >
                Sponsored
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
