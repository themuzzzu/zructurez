
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingCart, IndianRupee } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const DealsSection = () => {
  const { data: deals = [] } = useQuery({
    queryKey: ['deals-of-the-day'],
    queryFn: async () => {
      // In a real app, you would fetch from Supabase
      // Example deals data
      return [
        {
          id: 1,
          title: "Wireless Earbuds",
          image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop",
          original_price: 4999,
          discounted_price: 2499,
          discount_percentage: 50,
          ends_in: "8h 15m",
        },
        {
          id: 2,
          title: "Smart Watch Series 5",
          image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1972&auto=format&fit=crop",
          original_price: 19999,
          discounted_price: 13299,
          discount_percentage: 33,
          ends_in: "6h 30m",
        },
        {
          id: 3,
          title: "Bluetooth Speaker",
          image_url: "https://images.unsplash.com/photo-1589003077984-894e762f8865?q=80&w=1964&auto=format&fit=crop",
          original_price: 6499,
          discounted_price: 3999,
          discount_percentage: 38,
          ends_in: "12h 45m",
        },
        {
          id: 4,
          title: "Gaming Mouse",
          image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=2065&auto=format&fit=crop",
          original_price: 2999,
          discounted_price: 1499,
          discount_percentage: 50,
          ends_in: "5h 50m",
        },
        {
          id: 5,
          title: "Mechanical Keyboard",
          image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop",
          original_price: 6499,
          discounted_price: 4499,
          discount_percentage: 31,
          ends_in: "9h 20m",
        },
        {
          id: 6,
          title: "Wireless Charger",
          image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1972&auto=format&fit=crop",
          original_price: 2499,
          discounted_price: 1499,
          discount_percentage: 40,
          ends_in: "7h 10m",
        },
        {
          id: 7,
          title: "Fitness Tracker",
          image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd6f0?q=80&w=1974&auto=format&fit=crop",
          original_price: 3999,
          discounted_price: 2499,
          discount_percentage: 38,
          ends_in: "10h 20m",
        },
      ];
    }
  });

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
          {deals.map((deal) => (
            <CarouselItem key={deal.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-card dark:border-border">
                <div className="p-2">
                  <AspectRatio ratio={1}>
                    <img 
                      src={deal.image_url} 
                      alt={deal.title} 
                      className="rounded-md object-cover w-full h-full transition-transform hover:scale-105 duration-500"
                    />
                  </AspectRatio>
                  <div className="p-2">
                    <h3 className="font-medium text-sm line-clamp-1">{deal.title}</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-lg font-bold flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {formatPrice(deal.discounted_price).replace('₹', '')}
                      </span>
                      <span className="text-xs line-through text-muted-foreground ml-1">
                        ₹{formatPrice(deal.original_price).replace('₹', '')}
                      </span>
                      <Badge variant="outline" className="bg-green-100/10 text-green-500 dark:text-green-400 ml-2 text-xs">
                        {deal.discount_percentage}% off
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Ends in {deal.ends_in}</span>
                    </div>
                    <Button className="w-full mt-2" size="sm" variant="secondary">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 rounded-full bg-background dark:bg-background/20 text-foreground hover:bg-muted" />
          <CarouselNext className="static translate-y-0 rounded-full bg-background dark:bg-background/20 text-foreground hover:bg-muted" />
        </div>
      </Carousel>
    </div>
  );
};
