
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Array of sample banners for testing
const SAMPLE_BANNERS = [
  {
    id: '1',
    title: 'New Arrivals',
    description: 'Check out our latest products just for you',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae',
    link: '/marketplace?category=new',
    color: 'bg-blue-100 dark:bg-blue-950',
    textColor: 'text-blue-800 dark:text-blue-200',
  },
  {
    id: '2',
    title: 'Flash Sale',
    description: 'Get up to 50% off on selected items',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
    link: '/marketplace?sale=true',
    color: 'bg-orange-100 dark:bg-orange-950',
    textColor: 'text-orange-800 dark:text-orange-200',
  },
  {
    id: '3',
    title: 'Exclusive Deals',
    description: 'Members-only special offers',
    image: 'https://images.unsplash.com/photo-1607081380929-8cdf33f51218',
    link: '/marketplace?exclusive=true',
    color: 'bg-purple-100 dark:bg-purple-950',
    textColor: 'text-purple-800 dark:text-purple-200',
  },
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SAMPLE_BANNERS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Pause auto-rotation on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? SAMPLE_BANNERS.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SAMPLE_BANNERS.length);
    setIsAutoPlaying(false);
  };

  const goToBanner = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentBanner = SAMPLE_BANNERS[currentIndex];

  return (
    <div 
      className="relative rounded-xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className={cn(
            "rounded-xl overflow-hidden h-40 sm:h-56 md:h-64 lg:h-72", 
            currentBanner.color
          )}>
            <div className="grid grid-cols-2 h-full">
              <div className="flex flex-col justify-center p-6 space-y-2">
                <h3 className={cn("text-xl sm:text-2xl font-bold", currentBanner.textColor)}>
                  {currentBanner.title}
                </h3>
                <p className={cn("text-sm sm:text-base hidden sm:block", currentBanner.textColor)}>
                  {currentBanner.description}
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate(currentBanner.link)}
                  className="w-full sm:w-auto mt-2"
                >
                  Shop Now
                </Button>
              </div>
              <div className="relative h-full overflow-hidden">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 sm:w-10 sm:h-10 opacity-70 hover:opacity-100"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 sm:w-10 sm:h-10 opacity-70 hover:opacity-100"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {SAMPLE_BANNERS.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full",
              index === currentIndex
                ? "bg-primary"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => goToBanner(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
