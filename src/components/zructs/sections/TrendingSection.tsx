
import React from "react";

export const TrendingSection = () => {
  // Sample trending products data
  const products = [
    { id: 1, name: "Smart Home Hub", price: 129.99, image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png", soldCount: 234 },
    { id: 2, name: "Fitness Tracker", price: 79.99, image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png", soldCount: 195 },
    { id: 3, name: "Portable Power Bank", price: 49.99, image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png", soldCount: 178 },
    { id: 4, name: "Wireless Mouse", price: 34.99, image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png", soldCount: 156 },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Trending Now</h2>
        <a href="#" className="text-blue-600 text-sm">View all</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-medium mb-1 truncate">{product.name}</h3>
              <p className="text-gray-900 font-bold mb-1">${product.price}</p>
              <p className="text-sm text-gray-500">{product.soldCount} sold this week</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
