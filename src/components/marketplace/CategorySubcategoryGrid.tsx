
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CategorySubcategoryGridProps {
  onCategorySelect: (category: string, subcategory?: string) => void;
}

export const CategorySubcategoryGrid = ({ onCategorySelect }: CategorySubcategoryGridProps) => {
  // Define comprehensive category and subcategory mappings
  const categorySubcategories = {
    'electronics': [
      'Mobile Phones', 'Laptops & Computers', 'Audio', 'Cameras', 'Wearables', 'Accessories'
    ],
    'fashion': [
      'Men\'s Clothing', 'Women\'s Clothing', 'Footwear', 'Watches & Eyewear', 'Jewelry'
    ],
    'home-furniture': [
      'Furniture', 'Home Decor', 'Lighting'
    ],
    'watches': [
      'Analog', 'Digital', 'Smart Watches', 'Luxury', 'Sports', 'Fashion'
    ],
    'appliances': [
      'Kitchen Appliances', 'Home Appliances'
    ],
    'toys-kids': [
      'Toys', 'Kids Fashion'
    ],
    'kitchen': [
      'Cookware', 'Utensils', 'Appliances', 'Tableware', 'Storage', 'Bakeware'
    ],
    'books': [
      'Fiction', 'Non-Fiction', 'Educational', 'Comics'
    ],
    'beauty-personal-care': [
      'Skincare', 'Haircare', 'Grooming'
    ],
    'sports-outdoors': [
      'Sports Equipment', 'Outdoor Gear'
    ],
    'home-decor': [
      'Wall Art', 'Clocks', 'Curtains', 'Rugs'
    ]
  };

  // Get current category from URL
  const [currentCategory, setCurrentCategory] = useState('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || '';
    setCurrentCategory(categoryParam);
  }, [window.location.search]);
  
  // Get subcategories for the current category
  const subcategories = categorySubcategories[currentCategory as keyof typeof categorySubcategories] || [];
  
  if (subcategories.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-3 text-sm">Choose from {currentCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Categories</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory}
            className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            onClick={() => {
              const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
              onCategorySelect(currentCategory, subcategorySlug);
              toast.success(`Browsing ${subcategory}`);
            }}
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
