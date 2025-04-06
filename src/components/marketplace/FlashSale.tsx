
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Timer, ShoppingCart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/productUtils';

export const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 59,
    seconds: 59
  });
  
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const [products, setProducts] = useState([
    {
      id: '1',
      title: 'Wireless Earbuds',
      originalPrice: 5999,
      salePrice: 2999,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1606741965326-cb990f01c8cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80',
      remaining: 5
    },
    {
      id: '2',
      title: 'Smart Watch Series 5',
      originalPrice: 14999,
      salePrice: 8999,
      discount: 40,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80',
      remaining: 3
    },
    {
      id: '3',
      title: 'Portable Bluetooth Speaker',
      originalPrice: 7999,
      salePrice: 3999,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80',
      remaining: 7
    },
    {
      id: '4',
      title: 'Noise Cancelling Headphones',
      originalPrice: 19999,
      salePrice: 11999,
      discount: 40,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80',
      remaining: 2
    },
  ]);
  
  // Simulate images loaded after a short timeout for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Flash Sale</h2>
          <Badge variant="destructive" className="ml-2 text-xs px-2 py-1 font-bold">HOT</Badge>
        </div>
        <div className="flex items-center bg-red-50 dark:bg-red-950 px-3 py-1 rounded-full">
          <Timer className="w-4 h-4 text-red-500 mr-1" />
          <span className="text-red-600 dark:text-red-400 font-medium">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: imagesLoaded ? 1 : 0, y: imagesLoaded ? 0 : 20 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                {!imagesLoaded ? (
                  <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
                ) : (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/300x300/EEE/31343C?text=Image";
                    }}
                  />
                )}
                <Badge 
                  variant="destructive" 
                  className="absolute top-2 right-2 font-bold"
                >
                  {product.discount}% OFF
                </Badge>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium line-clamp-2 mb-2">{product.title}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold">₹{formatPrice(product.salePrice).replace('₹', '')}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{formatPrice(product.originalPrice).replace('₹', '')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-amber-600 dark:text-amber-500 text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{product.remaining} left</span>
                  </div>
                </div>
                
                <Button className="w-full gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
