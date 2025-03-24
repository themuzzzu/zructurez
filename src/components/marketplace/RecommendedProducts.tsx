
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const RecommendedProducts = () => {
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  // Function to fetch recommended products based on user preferences
  const { data: recommendedProducts = [], isLoading } = useQuery({
    queryKey: ['recommended-products', currentUser?.id],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      // If user is logged in, try to get personalized recommendations
      if (currentUser) {
        // Get user's purchase history
        const { data: purchaseHistory } = await supabase
          .from('product_purchases')
          .select('product_id')
          .eq('user_id', currentUser.id);
          
        // Get categories from purchase history
        if (purchaseHistory && purchaseHistory.length > 0) {
          const purchasedIds = purchaseHistory.map(item => item.product_id);
          
          const { data: purchasedProducts } = await supabase
            .from('products')
            .select('category')
            .in('id', purchasedIds);
            
          if (purchasedProducts && purchasedProducts.length > 0) {
            // Extract unique categories
            const userCategories = [...new Set(purchasedProducts.map(p => p.category))];
            
            if (userCategories.length > 0) {
              // Prioritize products in the same categories
              query = query.in('category', userCategories);
            }
          }
        }
      }
      
      // Final query with defaults
      const { data, error } = await query
        .eq('is_discounted', true) // Prioritize discounted items
        .order('views', { ascending: false }) // Popular items
        .limit(8);
        
      if (error) throw error;
      return data || [];
    },
  });
  
  const addToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to add items to your cart");
        return;
      }
      
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1
      });
      
      if (error) throw error;
      toast.success("Product added to cart");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </CardContent>
            <CardFooter>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (recommendedProducts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Sparkles className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Personalizing Your Experience</h3>
        <p className="text-muted-foreground">
          Browse more products to get tailored recommendations based on your interests.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {recommendedProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
          <div 
            className="aspect-square relative cursor-pointer" 
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            {product.is_discounted && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                {product.discount_percentage}% OFF
              </Badge>
            )}
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 left-2 h-8 w-8 bg-white/80 hover:bg-white text-pink-500 hover:text-pink-600"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-sm line-clamp-2" title={product.title}>
              {product.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="flex items-center mb-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">₹{product.price}</span>
              {product.is_discounted && product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.original_price}
                </span>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full"
              size="sm"
              onClick={() => addToCart(product.id)}
              disabled={addingToCart === product.id}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
