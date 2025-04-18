
import { BannerAd } from "@/components/ads/BannerAd";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function HomeBannerAds() {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['home-banner-ads'],
    queryFn: () => fetchActiveAds("home", "banner", 3),
  });

  if (isLoading) {
    return (
      <div className="w-full px-0 sm:px-2">
        <Skeleton className="w-full h-[200px] sm:h-[300px] rounded-lg" />
      </div>
    );
  }

  if (!ads.length) {
    return null;
  }

  return (
    <div className="w-full px-0 sm:px-2">
      <Carousel className="w-full">
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <div className="p-0 sm:p-1">
                <BannerAd ad={ad} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
