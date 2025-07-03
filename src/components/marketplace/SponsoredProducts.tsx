
import React from "react";
import { ProductCard } from "../products/ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category?: string;
  city?: string;
}

export const SponsoredProducts = () => {
  // Mock sponsored products data
  const sponsoredProducts: Product[] = [
    {
      id: "1",
      title: "Premium Laptop",
      price: 75000,
      image_url: "/lovable-uploads/laptop-sponsored.jpg",
      category: "Electronics",
      city: "Sponsored"
    },
    {
      id: "2", 
      title: "Wireless Headphones",
      price: 12000,
      image_url: "/lovable-uploads/headphones-sponsored.jpg",
      category: "Electronics",
      city: "Sponsored"
    }
  ];

  if (sponsoredProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sponsored Products</h3>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Ad</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sponsoredProducts.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard 
              product={{
                ...product,
                user_id: "sponsored",
                description: `Sponsored ${product.title}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_available: true
              }}
              layout="grid2x2"
            />
            <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded font-medium">
              Sponsored
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
