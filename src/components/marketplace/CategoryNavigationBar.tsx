
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CategoryNavigationBarProps {
  categories?: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  className?: string;
}

export const CategoryNavigationBar = ({
  categories = ["All", "Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Toys"],
  selectedCategory = "All",
  onCategorySelect,
  className
}: CategoryNavigationBarProps) => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category.toLowerCase());
    } else {
      if (category.toLowerCase() === 'all') {
        navigate('/marketplace');
      } else {
        navigate(`/marketplace/category/${category.toLowerCase()}`);
      }
    }
  };
  
  return (
    <div className={cn("flex overflow-x-auto scrollbar-hide gap-2 pb-2", className)}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory.toLowerCase() === category.toLowerCase() ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryNavigationBar;
