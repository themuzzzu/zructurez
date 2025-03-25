
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";
import { Sparkles, RefreshCw } from "lucide-react";
import { measureApiCall } from "@/utils/performanceTracking";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface RecommendationType {
  id: string;
  label: string;
  description: string;
}

const recommendationTypes: RecommendationType[] = [
  { 
    id: 'personalized', 
    label: 'For You', 
    description: 'Personalized recommendations based on your activity'
  },
  {
    id: 'trending',
    label: 'Trending',
    description: 'Popular products others are buying'
  },
  {
    id: 'similar',
    label: 'Similar to Recent Views',
    description: 'Products like the ones you viewed recently'
  },
  {
    id: 'category',
    label: 'Related Categories',
    description: "Items from categories you've shown interest in"
  }
];

export const SmartProductRecommendations = () => {
  const [selectedType, setSelectedType] = useState<string>('personalized');
  const { data: currentUser } = useCurrentUser();
  
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['product-recommendations', selectedType, currentUser?.id],
    queryFn: async () => {
      return await measureApiCall(`product-recommendations-${selectedType}`, async () => {
        // In a real application, this would call a more sophisticated 
        // recommendation engine with ML capabilities
        
        let query = supabase.from('products').select('*, product_purchases(id)');
        
        switch (selectedType) {
          case 'personalized':
            if (currentUser) {
              // Get user's purchase history
              const { data: purchaseHistory } = await supabase
                .from('product_purchases')
                .select('product_id')
                .eq('user_id', currentUser.id);
                
              if (purchaseHistory && purchaseHistory.length > 0) {
                // Get categories from purchased products
                const purchasedIds = purchaseHistory.map(item => item.product_id);
                
                const { data: purchasedProducts } = await supabase
                  .from('products')
                  .select('category')
                  .in('id', purchasedIds);
                  
                if (purchasedProducts && purchasedProducts.length > 0) {
                  const userCategories = [...new Set(purchasedProducts.map(p => p.category))];
                  
                  if (userCategories.length > 0) {
                    // Find products in same categories, but not already purchased
                    query = query.in('category', userCategories)
                      .not('id', 'in', purchasedIds);
                  }
                }
              }
            }
            
            // Default sorting for personalized
            query = query.order('created_at', { ascending: false });
            break;
            
          case 'trending':
            // Sort by views and recent purchases
            query = query.order('views', { ascending: false });
            break;
            
          case 'similar':
            // In a real app, this would use a similarity algorithm
            // For demo purposes, we'll just show products with similar categories
            if (currentUser) {
              const { data: recentViews } = await supabase
                .from('performance_metrics')
                .select('metadata')
                .eq('user_id', currentUser.id)
                .order('timestamp', { ascending: false })
                .limit(5);
                
              if (recentViews && recentViews.length > 0) {
                // Extract product IDs from recent page views
                const productIds = recentViews
                  .filter(view => {
                    // Fix: Safely access metadata.path with type checking
                    const metadata = view.metadata;
                    if (metadata && typeof metadata === 'object' && 'path' in metadata) {
                      return (metadata.path as string)?.includes('/product/');
                    }
                    return false;
                  })
                  .map(view => {
                    // Fix: Safely access metadata.path with type checking
                    const metadata = view.metadata;
                    if (metadata && typeof metadata === 'object' && 'path' in metadata) {
                      const path = metadata.path as string;
                      const match = path?.match(/\/product\/([^\/]+)/);
                      return match ? match[1] : null;
                    }
                    return null;
                  })
                  .filter(Boolean);
                  
                if (productIds.length > 0) {
                  const { data: similarProducts } = await supabase
                    .from('products')
                    .select('category')
                    .in('id', productIds);
                    
                  if (similarProducts && similarProducts.length > 0) {
                    const categories = [...new Set(similarProducts.map(p => p.category))];
                    query = query.in('category', categories);
                  }
                }
              }
            }
            break;
            
          case 'category':
            // Get products from categories user has shown interest in
            if (currentUser) {
              const { data: recentCategories } = await supabase
                .from('performance_metrics')
                .select('metadata')
                .eq('user_id', currentUser.id)
                .order('timestamp', { ascending: false })
                .limit(20);
                
              if (recentCategories && recentCategories.length > 0) {
                // Extract categories from recent searches or page views
                const categoryParams = recentCategories
                  .filter(view => {
                    // Fix: Safely access metadata.path with type checking
                    const metadata = view.metadata;
                    if (metadata && typeof metadata === 'object' && 'path' in metadata) {
                      return (metadata.path as string)?.includes('category=');
                    }
                    return false;
                  })
                  .map(view => {
                    // Fix: Safely access metadata.path with type checking
                    const metadata = view.metadata;
                    if (metadata && typeof metadata === 'object' && 'path' in metadata) {
                      const path = metadata.path as string;
                      const match = path?.match(/category=([^&]+)/);
                      return match ? match[1] : null;
                    }
                    return null;
                  })
                  .filter(Boolean);
                  
                if (categoryParams.length > 0) {
                  query = query.in('category', categoryParams);
                }
              }
            }
            break;
            
          default:
            // Default recommendations
            query = query.order('created_at', { ascending: false });
        }
        
        // Get a reasonable number of recommendations
        const { data, error } = await query.limit(8);
        
        if (error) throw error;
        
        // Process the data to add sales count
        return data.map(product => {
          const salesCount = Array.isArray(product.product_purchases) 
            ? product.product_purchases.length 
            : 0;
            
          return {
            ...product,
            sales_count: salesCount,
          };
        });
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleRefresh = () => {
    toast.info("Refreshing recommendations...");
    refetch();
  };
  
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <CardTitle>Smart Recommendations</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendationTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                title={type.description}
              >
                {type.label}
              </Button>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-1" 
              onClick={handleRefresh} 
              title="Refresh recommendations"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <div className="aspect-square relative">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : !recommendations || recommendations.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Personalizing your experience</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              As you browse and interact with the marketplace, we'll learn your preferences to show 
              better recommendations. Start exploring now!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t">
          <p className="text-xs text-muted-foreground italic">
            Recommendations are personalized based on your activity
          </p>
          {currentUser ? (
            <Badge variant="outline" className="text-xs">
              Personalized
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Sign in for personalized recommendations
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
