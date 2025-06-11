
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const sampleBanners = [
  {
    id: '1',
    title: 'Summer Sale',
    description: 'Up to 50% off on selected items',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: '2',
    title: 'New Arrivals',
    description: 'Check out our latest collection',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: '3',
    title: 'Special Offers',
    description: 'Limited time deals you can\'t miss',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=300&fit=crop',
    color: 'from-red-500 to-pink-600'
  }
];

export const BannerCarousel: React.FC = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {sampleBanners.map((banner) => (
          <CarouselItem key={banner.id}>
            <Card className="overflow-hidden border-0">
              <div className="relative h-[200px] sm:h-[300px]">
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-90`} />
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-bold mb-2">{banner.title}</h2>
                    <p className="text-sm sm:text-lg opacity-90">{banner.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};
