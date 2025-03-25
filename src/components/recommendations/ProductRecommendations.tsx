
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";
import { Sparkles, RefreshCw, MapPin, ShoppingBag, PieChart } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface RecommendationType {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const recommendationTypes: RecommendationType[] = [
  { 
    id: 'people-bought',
    label: 'People Also Bought', 
    description: 'Based on actual purchase patterns',
    icon: <ShoppingBag className="h-4 w-4" />
  },
  {
    id: 'trending',
    label: 'Trending Near You',
    description: 'Popular in your location',
    icon: <MapPin className="h-4 w-4" />
  },
  {
    id: 'browsing',
    label: 'Inspired by Your Browsing',
    description: 'Based on your browsing history',
    icon: <PieChart className="h-4 w-4" />
  },
  {
    id: 'sponsored',
    label: 'Sponsored Picks',
    description: 'Featured products from our partners',
    icon: <Sparkles className="h-4 w-4" />
  }
];

export const ProductRecommendations = () => {
  const [selectedType, setSelectedType] = useState<string>('people-bought');
  const { data: currentUser } = useCurrentUser();
  
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['product-recommendations', selectedType, currentUser?.id],
    queryFn: async () => {
      // In a real application, this would call an AI service
      // For now, we'll simulate recommendations based on type
      
      let query = supabase.from('products').select('*');
      
      switch (selectedType) {
        case 'people-bought':
          // Products most commonly bought together
          if (currentUser) {
            // Get user's purchase history
            const { data: purchaseHistory } = await supabase
              .from('product_purchases')
              .select('product_id')
              .eq('user_id', currentUser.id);
              
            if (purchaseHistory && purchaseHistory.length > 0) {
              // Find products bought by users who bought the same products
              const purchasedIds = purchaseHistory.map(item => item.product_id);
              
              // In a real app, this would be a collaborative filtering algorithm
              query = query.not('id', 'in', purchasedIds);
            }
          }
          
          // Default to popular products
          query = query.order('views', { ascending: false });
          break;
          
        case 'trending':
          // Products trending in user's location
          // For demo purposes, just sort by views
          query = query.order('views', { ascending: false });
          break;
          
        case 'browsing':
          // Personalized based on browsing
          if (currentUser) {
            // In a real app, this would be more sophisticated
            // For now, just recommend products in categories they've viewed
            // This is a simplification of what would normally be done with embeddings
            query = query.order('created_at', { ascending: false });
          } else {
            query = query.order('views', { ascending: false });
          }
          break;
          
        case 'sponsored':
          // Sponsored products
          query = query.eq('is_branded', true);
          break;
          
        default:
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query.limit(6);
      
      if (error) throw error;
      return data || [];
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
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Product Recommendations</CardTitle>
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
                {type.icon}
                <span className="ml-1">{type.label}</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
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
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Personalizing your experience</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              As you browse and interact with products, our AI will learn your preferences and show you 
              better recommendations. Start exploring now!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t">
          <p className="text-xs text-muted-foreground italic">
            {selectedType === 'people-bought' && "Based on actual purchase patterns"}
            {selectedType === 'trending' && "Popular products in your area"}
            {selectedType === 'browsing' && "Personalized based on your browsing"}
            {selectedType === 'sponsored' && "Featured products from our partners"}
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
}
