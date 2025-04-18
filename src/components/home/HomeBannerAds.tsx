
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
    return <Skeleton className="w-full h-[200px] rounded-lg" />;
  }

  if (!ads.length) {
    return null;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {ads.map((ad) => (
          <CarouselItem key={ad.id}>
            <div className="p-1">
              <BannerAd ad={ad} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
