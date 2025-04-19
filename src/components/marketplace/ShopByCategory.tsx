
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const ShopByCategory = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'grocery', name: 'Grocery', icon: '🛒' }
  ];
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/marketplace/category/${categoryId}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shop by Category</h2>
        <Button variant="link" onClick={() => navigate('/marketplace/categories')} className="text-blue-600">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map(category => (
          <Button
            key={category.id}
            variant="outline"
            className="flex flex-col items-center justify-center h-24 bg-background hover:bg-muted"
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="text-2xl mb-2">{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
