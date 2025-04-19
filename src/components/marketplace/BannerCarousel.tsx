
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BannerCarousel = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% off on selected items",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      buttonText: "Shop Now",
      buttonLink: "/marketplace/summer-sale",
      backgroundColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Check out the latest products",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      buttonText: "Explore",
      buttonLink: "/marketplace/new-arrivals",
      backgroundColor: "bg-purple-500",
    },
    {
      id: 3,
      title: "Limited Time Offer",
      subtitle: "Free shipping on orders over $50",
      image: "/lovable-uploads/070ce457-b6df-45a3-9490-d74e701eca37.png",
      buttonText: "Learn More",
      buttonLink: "/marketplace/promotions",
      backgroundColor: "bg-green-500",
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="relative rounded-xl overflow-hidden mb-6">
      <div className="overflow-hidden rounded-xl">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`${
              index === activeSlide ? "block" : "hidden"
            } relative ${banner.backgroundColor} text-white rounded-xl overflow-hidden`}
          >
            <div className="flex flex-col md:flex-row items-center p-6 sm:p-8">
              <div className="md:w-1/2 mb-4 md:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{banner.title}</h2>
                <p className="text-white/80 mb-4">{banner.subtitle}</p>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black"
                  onClick={() => navigate(banner.buttonLink)}
                >
                  {banner.buttonText}
                </Button>
              </div>
              <div className="md:w-1/2 md:pl-6 flex justify-center">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="max-h-48 object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/40 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 text-white hover:bg-white/40 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeSlide ? "bg-white" : "bg-white/40"
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
