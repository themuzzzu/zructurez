
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { measureApiCall } from "@/utils/performanceTracking";

interface SponsoredProductProps {
  ad: {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    reference_id: string;
    budget: number;
  };
  productData?: {
    price: number;
    is_discounted?: boolean;
    discount_percentage?: number;
    original_price?: number;
  };
}

export const SponsoredProduct = ({ ad, productData }: SponsoredProductProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Track ad impression when it becomes visible
  useEffect(() => {
    // Use Intersection Observer API to track when ad is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Record impression only once
            measureApiCall('ad-impression', async () => {
              try {
                await supabase.rpc('increment_ad_views', { ad_id: ad.id });
              } catch (err) {
                console.error('Error logging ad impression:', err);
              }
            });
            // Disconnect after recording
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 } // 50% visibility required
    );
    
    // Get the current element for this component
    const adElement = document.getElementById(`ad-${ad.id}`);
    if (adElement) {
      observer.observe(adElement);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [ad.id]);
  
  const handleViewClick = async () => {
    // Record click
    try {
      const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: ad.id });
      if (error) console.error('Error incrementing clicks:', error);
      
      // Navigate to product
      navigate(`/product/${ad.reference_id}`);
    } catch (err) {
      console.error('Error handling ad click:', err);
    }
  };

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Record click
      await supabase.rpc('increment_ad_clicks', { ad_id: ad.id });
      
      const { error } = await supabase.from('cart_items').insert({
        user_id: user.id,
        product_id: ad.reference_id,
        quantity: 1
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      toast.success("Product added to cart");
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add product to cart");
    },
  });

  // Optimize image rendering
  const optimizedImageUrl = ad.image_url 
    ? ad.image_url.includes('?') 
      ? `${ad.image_url}&quality=80&width=400` 
      : `${ad.image_url}?quality=80&width=400`
    : null;

  return (
    <Card id={`ad-${ad.id}`} className="overflow-hidden border-yellow-300 hover:shadow-md transition-all">
      <div className="relative">
        {optimizedImageUrl && (
          <div className="aspect-video w-full overflow-hidden">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
            )}
            <img 
              src={optimizedImageUrl} 
              alt={ad.title} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-yellow-500/90">
          Sponsored
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle>{ad.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{ad.description}</p>
        {productData && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">₹{productData.price}</span>
            {productData.is_discounted && productData.original_price && (
              <>
                <span className="text-sm text-muted-foreground line-through">₹{productData.original_price}</span>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  {productData.discount_percentage}% off
                </Badge>
              </>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={handleViewClick}>
          View
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          onClick={() => addToCartMutation.mutate()} 
          disabled={addToCartMutation.isPending}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
