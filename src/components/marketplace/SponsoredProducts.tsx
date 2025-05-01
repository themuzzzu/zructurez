
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { incrementAdView } from "@/services/adService";

export const SponsoredProducts = () => {
  const navigate = useNavigate();
  
  // Fetch sponsored products (ads with type 'product')
  const { data: sponsoredProducts = [], isLoading } = useQuery({
    queryKey: ['sponsored-products'],
    queryFn: async () => {
      const { data: ads, error } = await supabase
        .from('advertisements')
        .select(`
          id,
          title,
          description,
          image_url,
          reference_id,
          products(id, title, price, image_url)
        `)
        .eq('type', 'product')
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .limit(4);

      if (error) {
        console.error('Error fetching sponsored products:', error);
        return [];
      }

      return ads.map(ad => ({
        id: ad.reference_id || ad.id,
        title: ad.products?.title || ad.title,
        price: ad.products?.price ? `$${ad.products.price.toFixed(2)}` : '$29.99',
        image: ad.products?.image_url || ad.image_url || "/placeholder.png",
        rating: 4,
        adId: ad.id
      }));
    },
  });

  // Record views for the ads
  useEffect(() => {
    if (sponsoredProducts?.length) {
      sponsoredProducts.forEach(product => {
        if (product.adId) {
          incrementAdView(product.adId);
        }
      });
    }
  }, [sponsoredProducts]);

  const handleSeeAll = () => {
    navigate("/marketplace/sponsored");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Fallback to demo content if no sponsored products
  const displayProducts = sponsoredProducts.length > 0 
    ? sponsoredProducts 
    : [
        {
          id: "1",
          title: "Headphones",
          price: "$29.99",
          image: "/placeholder.png",
          rating: 4
        },
        {
          id: "2",
          title: "Smartwatch",
          price: "$129.99",
          image: "/placeholder.png",
          rating: 4
        },
        {
          id: "3",
          title: "Sneakers",
          price: "$49.99",
          image: "/placeholder.png",
          rating: 4
        },
        {
          id: "4",
          title: "Television",
          price: "$599.99",
          image: "/placeholder.png",
          rating: 4
        }
      ];

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          Sponsored
        </h2>
        <Button variant="link" className="text-blue-500" onClick={handleSeeAll}>
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {displayProducts.map((product) => (
          <Card 
            key={product.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="aspect-square p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
              <div className="mt-1 font-bold text-base">{product.price}</div>
              <div className="mt-1 flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
