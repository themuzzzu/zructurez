
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ShopByCategory = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: "electronics", name: "Electronics", icon: "💻" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "grocery", name: "Grocery", icon: "🛒" },
    { id: "home", name: "Home", icon: "🏠" },
    { id: "beauty", name: "Beauty", icon: "💄" },
    { id: "sports", name: "Sports", icon: "⚽" },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Shop by Category</h2>
        <Button variant="link" onClick={() => navigate("/categories")} className="text-blue-600">
          See All
        </Button>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/category/${category.id}`)}
          >
            <span className="text-3xl mb-2">{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </Card>
        ))}
      </div>
    </section>
  );
};
