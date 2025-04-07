
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BusinessCategoryNavBarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

// Business categories
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'cafes', name: 'Cafes' },
  { id: 'retail', name: 'Retail' },
  { id: 'beauty', name: 'Beauty & Spa' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'health', name: 'Healthcare' },
  { id: 'professional', name: 'Professional' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'education', name: 'Education' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'homeservices', name: 'Home Services' },
];

export const BusinessCategoryNavBar = ({ selectedCategory, onCategorySelect }: BusinessCategoryNavBarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-sm hidden md:flex"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-2 px-1 gap-2 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 rounded-full opacity-70 hover:opacity-100 shadow-sm hidden md:flex"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
