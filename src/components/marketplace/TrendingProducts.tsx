
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Star } from 'lucide-react';

export const TrendingProducts = () => {
  const navigate = useNavigate();
  
  const trendingProducts = [
    {
      id: "5",
      title: "Wireless Earbuds",
      price: "$89.99",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      rating: 5
    },
    {
      id: "6",
      title: "Smart Watch",
      price: "$159.99",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      rating: 4
    },
    {
      id: "7",
      title: "Fitness Tracker",
      price: "$79.99",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      rating: 4
    },
    {
      id: "8",
      title: "Bluetooth Speaker",
      price: "$129.99",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      rating: 5
    }
  ];

  const handleSeeAll = () => {
    navigate("/marketplace/trending");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-red-500" />
          Trending Now
        </h2>
        <Button variant="link" className="text-blue-500" onClick={handleSeeAll}>
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {trendingProducts.map((product) => (
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
                <Badge className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  Trending
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
