
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ServiceCategoryScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrician', name: 'Electrician' },
    { id: 'carpentry', name: 'Carpentry' },
    { id: 'painting', name: 'Painting' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'tutoring', name: 'Tutoring' },
    { id: 'pet-care', name: 'Pet Care' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'photography', name: 'Photography' },
    { id: 'graphic-design', name: 'Design' },
    { id: 'web-development', name: 'Web Dev' },
    { id: 'legal', name: 'Legal' },
    { id: 'accounting', name: 'Accounting' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'event-planning', name: 'Events' },
    { id: 'catering', name: 'Catering' }
  ];

  const checkArrowVisibility = () => {
    if (!scrollRef.current) return;
    
    setShowLeftArrow(scrollRef.current.scrollLeft > 0);
    setShowRightArrow(
      scrollRef.current.scrollLeft < 
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkArrowVisibility);
      // Check on initial load
      checkArrowVisibility();
      
      // Check on window resize
      window.addEventListener('resize', checkArrowVisibility);
    }
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkArrowVisibility);
      }
      window.removeEventListener('resize', checkArrowVisibility);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount 
      : scrollRef.current.scrollLeft + scrollAmount;
      
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="relative mb-8">
      <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
      
      <div className="relative">
        {showLeftArrow && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-md" 
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div 
          ref={scrollRef} 
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(category => (
            <Button
              key={category.id}
              variant="outline"
              className="flex-shrink-0 whitespace-nowrap"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {showRightArrow && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-md" 
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
