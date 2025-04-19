
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timer, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { BlurImage } from "@/components/ui/blur-image";

export const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0
  });
  
  const navigate = useNavigate();
  
  // Fetch flash sale products
  const { data: products, isLoading } = useQuery({
    queryKey: ['flash-sale-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_discounted', true)
        .gt('discount_percentage', 30)
        .order('discount_percentage', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
    staleTime: 60000 // Cache for 1 minute
  });
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 0, seconds: 0 }; // Reset for demo
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-32 bg-muted" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!products || products.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Flash Sale</h2>
          <div className="flex items-center gap-1 text-sm font-mono bg-red-50 text-red-600 px-2 py-1 rounded-full">
            <Timer className="h-4 w-4" />
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/marketplace?filter=flash-sale')}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="relative aspect-square">
              <BlurImage
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                aspectRatio="square"
                className="object-cover"
                fill
              />
              {product.discount_percentage && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  -{product.discount_percentage}%
                </Badge>
              )}
            </div>
            <div className="p-3 space-y-1">
              <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">
                  ₹{Math.round(product.price * (1 - (product.discount_percentage || 0) / 100))}
                </span>
                {product.discount_percentage && (
                  <span className="text-xs line-through text-muted-foreground">
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
