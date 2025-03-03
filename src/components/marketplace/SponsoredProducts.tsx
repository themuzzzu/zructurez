
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const SponsoredProducts = () => {
  const { data: sponsoredProducts = [] } = useQuery({
    queryKey: ['sponsored-products'],
    queryFn: async () => {
      // In a real app, you would fetch from Supabase
      // For now, using example data
      return [
        {
          id: 1,
          title: "Premium Bluetooth Headphones",
          image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
          price: 199.99,
          rating: 4.5,
          sponsored: true,
          category: "Audio"
        },
        {
          id: 2,
          title: "4K Smart TV 55-inch",
          image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057&auto=format&fit=crop",
          price: 599.99,
          rating: 4.7,
          sponsored: true,
          category: "Television"
        },
        {
          id: 3,
          title: "Professional Camera Kit",
          image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop",
          price: 1299.99,
          rating: 4.9,
          sponsored: true,
          category: "Photography"
        },
        {
          id: 4,
          title: "Ergonomic Office Chair",
          image_url: "https://images.unsplash.com/photo-1505843490701-5c4b83fe0a6e?q=80&w=1976&auto=format&fit=crop",
          price: 249.99,
          rating: 4.3,
          sponsored: true,
          category: "Furniture"
        },
        {
          id: 5,
          title: "Gaming Laptop Pro",
          image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop",
          price: 1499.99,
          rating: 4.8,
          sponsored: true,
          category: "Computers"
        },
        {
          id: 6,
          title: "Wireless Home Security System",
          image_url: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
          price: 349.99,
          rating: 4.6,
          sponsored: true,
          category: "Smart Home"
        },
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
          {sponsoredProducts.map((product) => (
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
                  <Badge className="absolute top-2 right-2 bg-primary/80">Sponsored</Badge>
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
                  <Button className="w-full mt-2" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
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
