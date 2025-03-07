
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds, fetchProductDetailsForAd } from "@/services/adService";
import { SponsoredProduct } from "@/components/ads/SponsoredProduct";
import { useEffect } from "react";
import { incrementAdView } from "@/services/adService";

export const SponsoredProducts = () => {
  const { data: productAds = [] } = useQuery({
    queryKey: ['sponsored-products'],
    queryFn: () => fetchActiveAds('product', 10),
  });

  const { data: productsData = {} } = useQuery({
    queryKey: ['sponsored-products-details', productAds.map(ad => ad.reference_id)],
    queryFn: async () => {
      if (productAds.length === 0) return {};
      
      const details = {};
      for (const ad of productAds) {
        const productData = await fetchProductDetailsForAd(ad.reference_id);
        if (productData) {
          details[ad.reference_id] = productData;
        }
      }
      return details;
    },
    enabled: productAds.length > 0,
  });

  // Record views for the ads
  useEffect(() => {
    if (productAds?.length) {
      productAds.forEach(ad => {
        incrementAdView(ad.id);
      });
    }
  }, [productAds]);

  if (!productAds.length) return null;

  return (
    <ScrollArea className="pb-4">
      <div className="flex space-x-4 pb-4">
        {productAds.map((ad) => (
          <div key={ad.id} className="w-[280px] flex-shrink-0">
            <SponsoredProduct 
              ad={ad} 
              productData={productsData[ad.reference_id]} 
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
