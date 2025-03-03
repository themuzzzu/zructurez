
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TrendingProducts = () => {
  const { data: trendingProducts = [] } = useQuery({
    queryKey: ['trending-products'],
    queryFn: async () => {
      // In a real app, you would fetch from Supabase with a views/sales count
      // Example data
      return [
        {
          id: 1,
          title: "Noise Cancelling Headphones",
          image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
          price: 149.99,
          rating: 4.6,
          views: 8520,
          category: "Electronics"
        },
        {
          id: 2,
          title: "Fitness Tracker with Heart Rate Monitor",
          image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd6f0?q=80&w=2088&auto=format&fit=crop",
          price: 89.99,
          rating: 4.4,
          views: 7350,
          category: "Wearables"
        },
        {
          id: 3,
          title: "Portable Bluetooth Speaker Waterproof",
          image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2062&auto=format&fit=crop",
          price: 69.99,
          rating: 4.2,
          views: 6890,
          category: "Audio"
        },
        {
          id: 4,
          title: "Wireless Charging Pad 15W Fast Charge",
          image_url: "https://images.unsplash.com/photo-1623126464548-c858d1a77517?q=80&w=1932&auto=format&fit=crop",
          price: 29.99,
          rating: 4.5,
          views: 5960,
          category: "Accessories"
        },
        {
          id: 5,
          title: "Smartphone Gimbal Stabilizer",
          image_url: "https://images.unsplash.com/photo-1569420067112-b57b4f024595?q=80&w=1887&auto=format&fit=crop",
          price: 119.99,
          rating: 4.8,
          views: 4870,
          category: "Photography"
        }
      ];
    }
  });

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-4">
        {trendingProducts.map((product) => (
          <Card key={product.id} className="flex-shrink-0 w-[250px] hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={4/3}>
                <img 
                  src={product.image_url} 
                  alt={product.title} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <Badge className="absolute top-2 right-2 bg-orange-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>
            <div className="p-3">
              <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
              <h3 className="font-medium text-sm line-clamp-2 h-10">{product.title}</h3>
              <div className="flex items-center mt-1 text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-50'}`} 
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold">${product.price}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {product.views.toLocaleString()} views
                </span>
                <Button size="sm">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
