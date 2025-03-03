
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      ];
    }
  });

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-4">
        {sponsoredProducts.map((product) => (
          <Card key={product.id} className="flex-shrink-0 w-[250px] hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={4/3}>
                <img 
                  src={product.image_url} 
                  alt={product.title} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <Badge className="absolute top-2 right-2 bg-primary/80">Sponsored</Badge>
            </div>
            <div className="p-3">
              <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
              <h3 className="font-medium text-sm line-clamp-2 h-10">{product.title}</h3>
              <div className="flex items-center mt-1 text-amber-500">
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current" />
                <Star className="h-3 w-3 fill-current opacity-50" />
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
        ))}
      </div>
    </ScrollArea>
  );
};
