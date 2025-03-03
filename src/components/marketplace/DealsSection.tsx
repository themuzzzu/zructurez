
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          original_price: 99.99,
          discounted_price: 49.99,
          discount_percentage: 50,
          ends_in: "8h 15m",
        },
        {
          id: 2,
          title: "Smart Watch Series 5",
          image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1972&auto=format&fit=crop",
          original_price: 299.99,
          discounted_price: 199.99,
          discount_percentage: 33,
          ends_in: "6h 30m",
        },
        {
          id: 3,
          title: "Bluetooth Speaker",
          image_url: "https://images.unsplash.com/photo-1589003077984-894e762f8865?q=80&w=1964&auto=format&fit=crop",
          original_price: 129.99,
          discounted_price: 79.99,
          discount_percentage: 38,
          ends_in: "12h 45m",
        },
        {
          id: 4,
          title: "Gaming Mouse",
          image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=2065&auto=format&fit=crop",
          original_price: 59.99,
          discounted_price: 29.99,
          discount_percentage: 50,
          ends_in: "5h 50m",
        },
        {
          id: 5,
          title: "Mechanical Keyboard",
          image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2080&auto=format&fit=crop",
          original_price: 129.99,
          discounted_price: 89.99,
          discount_percentage: 31,
          ends_in: "9h 20m",
        },
      ];
    }
  });

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-4">
        {deals.map((deal) => (
          <Card key={deal.id} className="flex-shrink-0 w-[200px] hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-2">
              <AspectRatio ratio={1}>
                <img 
                  src={deal.image_url} 
                  alt={deal.title} 
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-2">
                <h3 className="font-medium text-sm line-clamp-1">{deal.title}</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-lg font-bold">${deal.discounted_price}</span>
                  <span className="text-xs line-through text-muted-foreground ml-1">
                    ${deal.original_price}
                  </span>
                  <Badge variant="outline" className="bg-green-50 text-green-600 ml-2 text-xs">
                    {deal.discount_percentage}% off
                  </Badge>
                </div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Ends in {deal.ends_in}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
