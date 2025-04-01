
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategorySubcategoryGridProps {
  onCategorySelect: (category: string, subcategory?: string) => void;
}

export const CategorySubcategoryGrid = ({ onCategorySelect }: CategorySubcategoryGridProps) => {
  // Define category and subcategory mappings
  const categorySubcategories = {
    'electronics': [
      'Smartphones', 'Laptops', 'Audio', 'Cameras', 'Wearables', 'Accessories'
    ],
    'fashion': [
      'Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Jewelry'
    ],
    'home-decor': [
      'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Garden', 'Lighting'
    ],
    'watches': [
      'Analog', 'Digital', 'Smart Watches', 'Luxury', 'Sports', 'Fashion'
    ],
    'appliances': [
      'Refrigerators', 'Washing Machines', 'Air Conditioners', 'Fans', 'Vacuum Cleaners', 'Kitchen Appliances'
    ],
    'toys-&-kids': [
      'Educational', 'Action Figures', 'Dolls', 'Board Games', 'Outdoor', 'Baby Toys'
    ],
    'kitchen': [
      'Cookware', 'Utensils', 'Appliances', 'Tableware', 'Storage', 'Bakeware'
    ],
    'books': [
      'Fiction', 'Non-Fiction', 'Educational', 'Children', 'Comics', 'Self-Help'
    ]
  };

  // Get current category from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category') || '';
  
  // Get subcategories for the current category
  const subcategories = categorySubcategories[currentCategory as keyof typeof categorySubcategories] || [];
  
  if (subcategories.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory}
            className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            onClick={() => onCategorySelect(currentCategory, subcategory.toLowerCase())}
          >
            <Badge variant="outline" className="w-full justify-center py-1.5 hover:bg-primary hover:text-white transition-colors">
              {subcategory}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
