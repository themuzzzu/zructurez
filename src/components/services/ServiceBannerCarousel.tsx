
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ServiceBannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['service-banners'],
    queryFn: async () => {
      try {
        // Try to fetch actual banners from advertisements
        const { data: ads, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('location', 'services')
          .eq('status', 'approved')
          .limit(5);
          
        if (error || !ads || ads.length === 0) {
          // If no real ads, return mock data
          return [
            {
              id: '1',
              title: 'Premium Services',
              description: 'Find the best professional services for your needs',
              image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
              link: '/services?featured=true'
            },
            {
              id: '2',
              title: 'Service Professionals',
              description: 'Connect with top-rated service providers in your area',
              image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
              link: '/services?category=professional'
            },
            {
              id: '3',
              title: 'Home Services',
              description: 'Get your home projects done by local experts',
              image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
              link: '/services?category=home'
            },
          ];
        }
        
        return ads.map(ad => ({
          id: ad.id,
          title: ad.title,
          description: ad.description,
          image_url: ad.image_url || 'https://placehold.co/1200x400/darkgray/white?text=Service+Banner',
          link: ad.reference_id ? `/services/${ad.reference_id}` : '/services'
        }));
      } catch (err) {
        console.error('Error fetching service banners:', err);
        return [];
      }
    },
    staleTime: 60000, // 1 minute
  });

  // Auto-rotate slides every 3 seconds
  useEffect(() => {
    if (banners.length > 1) {
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide(current => (current + 1) % banners.length);
      }, 3000);
    }
    
    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [banners.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    
    // Reset timer when manually navigating
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
      slideTimerRef.current = setInterval(() => {
        setCurrentSlide(current => (current + 1) % banners.length);
      }, 3000);
    }
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % banners.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + banners.length) % banners.length);
  };

  if (isLoading || banners.length === 0) {
    return (
      <Card className="w-full h-[300px] mb-8 bg-muted animate-pulse flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading banners...</div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[300px] mb-8 overflow-hidden rounded-lg">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <Link 
            key={banner.id} 
            to={banner.link || '/services'}
            className="w-full h-full flex-shrink-0 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
            <img 
              src={banner.image_url} 
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20 max-w-lg">
              <h2 className="text-2xl font-bold text-white mb-2">{banner.title}</h2>
              <p className="text-white/90">{banner.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-30"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-30"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSlide(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
