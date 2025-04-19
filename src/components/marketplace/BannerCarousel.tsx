
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export interface BannerCarouselProps {
  banners?: Array<{
    id: string;
    image: string;
    title: string;
    link: string;
  }>;
}

export const BannerCarousel = ({ banners = [] }: BannerCarouselProps) => {
  const defaultBanners = [
    {
      id: "1",
      image: "https://via.placeholder.com/1200x400/3b82f6/FFFFFF?text=Special+Offers",
      title: "Special Offers",
      link: "/marketplace",
    },
    {
      id: "2",
      image: "https://via.placeholder.com/1200x400/10b981/FFFFFF?text=New+Products",
      title: "New Products",
      link: "/marketplace",
    },
    {
      id: "3",
      image: "https://via.placeholder.com/1200x400/6366f1/FFFFFF?text=Seasonal+Deals",
      title: "Seasonal Deals",
      link: "/marketplace",
    },
  ];

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {displayBanners.map((banner) => (
          <CarouselItem key={banner.id} className="md:basis-full">
            <div className="p-1 h-full">
              <div className="overflow-hidden rounded-xl h-[150px] md:h-[300px] relative">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-lg md:text-xl font-bold">{banner.title}</h3>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};
