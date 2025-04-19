
import React from "react";

interface CategoryIconGridProps {
  onCategorySelect: (category: string) => void;
}

export const CategoryIconGrid: React.FC<CategoryIconGridProps> = ({ onCategorySelect }) => {
  const categories = [
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "home", name: "Home", icon: "🏠" },
    { id: "beauty", name: "Beauty", icon: "💄" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "toys", name: "Toys", icon: "🧸" },
    { id: "books", name: "Books", icon: "📚" },
    { id: "garden", name: "Garden", icon: "🌱" },
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="flex flex-col items-center justify-center p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-2xl mb-2">{category.icon}</span>
          <span className="text-sm font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
};
