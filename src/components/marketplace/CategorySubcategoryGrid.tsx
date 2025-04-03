
import { useState, useEffect, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface CategorySubcategoryGridProps {
  onCategorySelect: (category: string, subcategory?: string) => void;
}

export const CategorySubcategoryGrid = ({ onCategorySelect }: CategorySubcategoryGridProps) => {
  // Define comprehensive category and subcategory mappings
  const categorySubcategories: Record<string, string[]> = {
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

  const navigate = useNavigate();
  
  // Get current category from params
  const { categoryId } = useParams<{ categoryId: string }>();
  const [currentCategory, setCurrentCategory] = useState(categoryId || '');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set a short timeout to simulate data loading and prevent flashing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    if (categoryId) {
      setCurrentCategory(categoryId);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category') || '';
      setCurrentCategory(categoryParam);
    }
    
    return () => clearTimeout(timer);
  }, [categoryId, window.location.search]);
  
  // Get subcategories for the current category
  const subcategories = currentCategory ? 
    categorySubcategories[currentCategory as keyof typeof categorySubcategories] || [] : [];
  
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-2">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    );
  }
  
  if (subcategories.length === 0 && currentCategory) {
    return (
      <Card className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
        <p className="text-muted-foreground">No subcategories found for {currentCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}.</p>
      </Card>
    );
  }
  
  if (subcategories.length === 0) {
    // Display all categories if no current category is selected
    return (
      <Card className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-3 text-sm">Browse Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.keys(categorySubcategories).map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              onClick={() => {
                onCategorySelect(category);
                toast.success(`Browsing ${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
                navigate(`/marketplace/category/${category}`);
              }}
            >
              <Badge variant="outline" className="w-full justify-center py-1.5 hover:bg-primary hover:text-white transition-colors">
                {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-3 text-sm">Choose from {currentCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Categories</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {subcategories.map((subcategory, index) => (
          <motion.div
            key={subcategory}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            onClick={() => {
              const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
              onCategorySelect(currentCategory, subcategorySlug);
              toast.success(`Browsing ${subcategory}`);
              navigate(`/marketplace/category/${currentCategory}/${subcategorySlug}`);
            }}
          >
            <Badge variant="outline" className="w-full justify-center py-1.5 hover:bg-primary hover:text-white transition-colors">
              {subcategory}
            </Badge>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
