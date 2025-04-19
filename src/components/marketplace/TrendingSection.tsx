
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const TrendingSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("electronics");
  
  const trendingProducts = {
    electronics: [
      {
        id: "9",
        title: "Wireless",
        price: "$99.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      },
      {
        id: "10",
        title: "Smartwatch",
        price: "$199.95",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      }
    ],
    home: [
      {
        id: "11",
        title: "Stand Mixer",
        price: "$349.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      },
      {
        id: "12",
        title: "Coffee Maker",
        price: "$89.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      }
    ],
    clothing: [
      {
        id: "13",
        title: "Jacket",
        price: "$119.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      },
      {
        id: "14",
        title: "Jeans",
        price: "$49.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      }
    ],
    toys: [
      {
        id: "15",
        title: "Gaming",
        price: "$39.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      },
      {
        id: "16",
        title: "Action Figure",
        price: "$24.99",
        image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
        rating: 4
      }
    ]
  };

  const handleSeeAll = () => {
    navigate(`/marketplace/trending/${activeCategory}`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Trending Now in Your Area</h2>
        <Button variant="link" className="text-blue-500" onClick={handleSeeAll}>
          See All
        </Button>
      </div>

      <Tabs defaultValue="electronics" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="electronics">Electronics</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="toys">Toys</TabsTrigger>
        </TabsList>
        
        {Object.entries(trendingProducts).map(([category, products]) => (
          <TabsContent key={category} value={category} className="m-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
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
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Add placeholder cards to fill the grid */}
              {Array(2).fill(0).map((_, i) => (
                <div key={`placeholder-${i}`} className="hidden sm:block"></div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
