
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ShoppingCardSkeleton } from '@/components/ShoppingCardSkeleton';
import { motion } from 'framer-motion';

// Sample categories with icons or emojis
const categories = [
  { id: '1', name: 'Electronics', icon: '🔌', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: '2', name: 'Fashion', icon: '👕', color: 'bg-pink-100 dark:bg-pink-900' },
  { id: '3', name: 'Home & Kitchen', icon: '🏠', color: 'bg-green-100 dark:bg-green-900' },
  { id: '4', name: 'Beauty', icon: '💄', color: 'bg-purple-100 dark:bg-purple-900' },
  { id: '5', name: 'Sports', icon: '⚽', color: 'bg-orange-100 dark:bg-orange-900' },
  { id: '6', name: 'Books', icon: '📚', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: '7', name: 'Toys', icon: '🧸', color: 'bg-red-100 dark:bg-red-900' },
  { id: '8', name: 'Handmade', icon: '🧶', color: 'bg-teal-100 dark:bg-teal-900' },
];

export function ShopByCategory() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category: string) => {
    navigate(`/marketplace?category=${category.toLowerCase()}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Shop by Category</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/marketplace/categories')}
          className="text-sm flex items-center gap-1"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="aspect-square animate-pulse bg-muted"></Card>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Card 
                className={`aspect-square flex flex-col items-center justify-center p-4 cursor-pointer hover:scale-105 transition-transform ${category.color}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="text-4xl mb-2">{category.icon}</span>
                <Badge variant="secondary" className="font-normal text-xs">
                  {category.name}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
