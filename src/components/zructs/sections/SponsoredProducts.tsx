
import React from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const SponsoredProducts = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: "1",
      name: "Headphones",
      price: 29.99,
      rating: 4,
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
    },
    {
      id: "2",
      name: "Smartwatch",
      price: 129.99,
      rating: 4,
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
    },
    {
      id: "3",
      name: "Sneakers",
      price: 49.99,
      rating: 4,
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
    },
    {
      id: "4",
      name: "Television",
      price: 599.99,
      rating: 4,
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sponsored</h2>
        <Button variant="link" onClick={() => navigate("/sponsored")} className="text-blue-600">
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="p-4 bg-gray-50 aspect-square flex items-center justify-center">
              <img src={product.image} alt={product.name} className="max-h-full object-contain" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-lg font-bold mt-1">${product.price}</p>
              <div className="flex mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
