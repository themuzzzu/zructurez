
import React from "react";

export const SponsoredProducts = () => {
  // Sample sponsored products data
  const products = [
    { id: 1, name: "Premium Headphones", price: 149.99, image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png", discount: "20%" },
    { id: 2, name: "Smartwatch Pro", price: 199.99, image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png", discount: "15%" },
    { id: 3, name: "Wireless Earbuds", price: 89.99, image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png", discount: "10%" },
    { id: 4, name: "Laptop Stand", price: 49.99, image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png", discount: "25%" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sponsored Products</h2>
        <a href="#" className="text-blue-600 text-sm">View all</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{product.discount}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1 truncate">{product.name}</h3>
              <p className="text-gray-900 font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
