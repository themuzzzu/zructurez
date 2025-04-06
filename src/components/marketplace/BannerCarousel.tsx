
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Advertisement } from "@/services/adService";

export const BannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Mock advertisement data - in a real app, this would come from an API
  const banners: Advertisement[] = [
    {
      id: "ad-1",
      title: "Summer Collection",
      description: "Discover our new summer collection with items up to 50% off!",
      image_url: "/placeholders/banner1.jpg",
      type: "product",
      format: "banner",
      reference_id: "collection-summer",
      status: "active",
      user_id: "user-1",
      location: "Global",
      budget: 1000,
      clicks: 240,
      impressions: 10500,
      start_date: "2023-05-01",
      end_date: "2023-08-31",
      created_at: "2023-04-20",
      video_url: null,
      carousel_images: null,
      business_id: "biz-1"
    },
    {
      id: "ad-2",
      title: "Local Services",
      description: "Find trusted professionals in your area for any home service needs.",
      image_url: "/placeholders/banner2.jpg",
      type: "service",
      format: "banner",
      reference_id: "services-home",
      status: "active",
      user_id: "user-2",
      location: "Local",
      budget: 750,
      clicks: 185,
      impressions: 8200,
      start_date: "2023-06-01",
      end_date: "2023-09-30",
      created_at: "2023-05-15",
      video_url: null,
      carousel_images: null,
      business_id: "biz-2"
    },
    {
      id: "ad-3",
      title: "New Business Opening",
      description: "Visit our grand opening this weekend and get exclusive first-customer offers!",
      image_url: "/placeholders/banner3.jpg",
      type: "business",
      format: "banner",
      reference_id: "business-opening",
      status: "active",
      user_id: "user-3",
      location: "Regional",
      budget: 500,
      clicks: 120,
      impressions: 4800,
      start_date: "2023-06-15",
      end_date: "2023-07-15",
      created_at: "2023-06-01",
      video_url: null,
      carousel_images: null,
      business_id: "biz-3"
    }
  ];

  const goToPrevious = () => {
    setActiveIndex((curr) => (curr === 0 ? banners.length - 1 : curr - 1));
  };

  const goToNext = () => {
    setActiveIndex((curr) => (curr === banners.length - 1 ? 0 : curr + 1));
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {banners.map((banner, index) => (
        <Link
          key={banner.id}
          to={`/${banner.type}/${banner.reference_id}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center flex items-center"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.image_url || "/placeholders/banner-fallback.jpg"})` 
            }}
          >
            <div className="container mx-auto px-4 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {banner.title}
              </h2>
              <p className="text-sm sm:text-base mb-4">
                {banner.description}
              </p>
              <Button className="bg-white text-black hover:bg-gray-100">
                Learn More
              </Button>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
            Sponsored
          </div>
        </Link>
      ))}
      
      {banners.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-4 bg-primary" : "w-2 bg-white/60"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
