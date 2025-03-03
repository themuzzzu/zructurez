
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
        },
        {
          id: 6,
          title: "Wireless Gaming Controller",
          image_url: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=2070&auto=format&fit=crop",
          price: 59.99,
          rating: 4.7,
          views: 5430,
          category: "Gaming"
        },
        {
          id: 7,
          title: "Smart Home Security Camera",
          image_url: "https://images.unsplash.com/photo-1557333310-5103d169ebda?q=80&w=1965&auto=format&fit=crop",
          price: 79.99,
          rating: 4.3,
          views: 4560,
          category: "Smart Home"
        }
      ];
    }
  });

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {trendingProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
                    />
                  </AspectRatio>
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                </div>
                <div className="p-3">
                  <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
                  <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
                  <div className="flex items-center mt-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
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
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 rounded-full" />
          <CarouselNext className="static translate-y-0 rounded-full" />
        </div>
      </Carousel>
    </div>
  );
};
