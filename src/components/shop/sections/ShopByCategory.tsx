
import React from "react";

export const ShopByCategory = () => {
  // Sample categories data
  const categories = [
    { id: 1, name: "Electronics", image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png" },
    { id: 2, name: "Fashion", image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png" },
    { id: 3, name: "Home & Kitchen", image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png" },
    { id: 4, name: "Beauty", image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png" },
    { id: 5, name: "Sports", image: "/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png" },
    { id: 6, name: "Books", image: "/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Shop By Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden mb-2">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
