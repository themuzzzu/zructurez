
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds, incrementAdView } from "@/services/adService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BannerAd } from "@/components/ads/BannerAd";
import { Card } from "@/components/ui/card";

export const BannerCarousel = () => {
  const { data: bannerAds = [] } = useQuery({
    queryKey: ['banner-ads'],
    queryFn: () => fetchActiveAds(undefined, "banner", 5),
  });

  // Record views for the ads
  useEffect(() => {
    if (bannerAds?.length) {
      bannerAds.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [bannerAds]);

  if (!bannerAds.length) {
    // If no ads, return placeholder
    return (
      <Card className="w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1] flex items-center justify-center">
          <div className="text-center p-4">
            <h3 className="text-lg md:text-xl font-bold text-primary">Discover Great Deals</h3>
            <p className="text-sm text-muted-foreground">Explore our marketplace for special offers</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
      autoplay
      interval={5000}
    >
      <CarouselContent>
        {bannerAds.map((ad) => (
          <CarouselItem key={ad.id} className="basis-full">
            <BannerAd ad={ad} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
