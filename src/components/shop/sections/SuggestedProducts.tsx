
import React from "react";

export const SuggestedProducts = () => {
  // Sample suggested products data
  const products = [
    { id: 1, name: "Wireless Charger", price: 29.99, image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png", rating: 4.5 },
    { id: 2, name: "Bluetooth Speaker", price: 59.99, image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png", rating: 4.2 },
    { id: 3, name: "Phone Case", price: 19.99, image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png", rating: 4.8 },
    { id: 4, name: "USB-C Cable Pack", price: 12.99, image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png", rating: 4.6 },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Suggested For You</h2>
        <a href="#" className="text-blue-600 text-sm">View all</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-medium mb-1 truncate">{product.name}</h3>
              <div className="flex items-center text-sm mb-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "stroke-current text-gray-300"}`} viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-gray-500">{product.rating}</span>
              </div>
              <p className="text-gray-900 font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
