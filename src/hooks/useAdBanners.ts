
import { useQuery } from "@tanstack/react-query";
import { fetchActiveAds } from "@/services/adService";
import type { AdType, Advertisement } from "@/types/advertising";

export const useAdBanners = (type?: AdType | string, format: string = "banner", limit: number = 5) => {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['ad-banners', type, format, limit],
    queryFn: async () => {
      try {
        const ads = await fetchActiveAds(type as AdType, format, limit);
        
        // If no ads returned from API, return fallback ads
        if (!ads || ads.length === 0) {
          return getFallbackAds(type as AdType);
        }
        
        return ads;
      } catch (error) {
        console.error("Error fetching banner ads:", error);
        return getFallbackAds(type as AdType);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return { ads, isLoading };
};

// Fallback ads in case the API fails or returns empty
const getFallbackAds = (type?: AdType): Advertisement[] => {
  // Generic banners
  const genericBanners = [
    {
      id: "fallback-banner-1",
      title: "Discover Premium Products",
      description: "Explore our curated collection of premium products at exclusive prices",
      image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&h=300&q=80",
      type: "product",
      format: "banner",
      reference_id: "premium-collection",
      status: "active",
      user_id: "system",
      budget: 1000,
      location: "Global",
      impressions: 5000,
      clicks: 250,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      video_url: null,
      carousel_images: null
    },
    {
      id: "fallback-banner-2",
      title: "Summer Sale",
      description: "Limited time offers on seasonal favorites. Up to 50% off!",
      image_url: "https://images.unsplash.com/photo-1528459105426-b9548367069a?auto=format&fit=crop&w=1200&h=300&q=80",
      type: "product",
      format: "banner",
      reference_id: "summer-sale",
      status: "active",
      user_id: "system",
      budget: 1500,
      location: "Global",
      impressions: 3500,
      clicks: 175,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      video_url: null,
      carousel_images: null
    }
  ];
  
  // Service-specific banners
  const serviceBanners = [
    {
      id: "fallback-service-1",
      title: "Professional Cleaning Services",
      description: "Keep your home spotless with our expert cleaning services. Book today for 20% off your first clean!",
      image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&h=300&q=80",
      type: "service",
      format: "banner",
      reference_id: "cleaning-services",
      status: "active",
      user_id: "system",
      budget: 800,
      location: "Global",
      impressions: 2000,
      clicks: 120,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      video_url: null,
      carousel_images: null
    },
    {
      id: "fallback-service-2",
      title: "Home Renovation Experts",
      description: "Transform your living space with our professional renovation services. Free consultation available!",
      image_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&h=300&q=80",
      type: "service",
      format: "banner",
      reference_id: "renovation-services",
      status: "active",
      user_id: "system",
      budget: 1200,
      location: "Global",
      impressions: 1800,
      clicks: 95,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      video_url: null,
      carousel_images: null
    }
  ];
  
  // Business-specific banners
  const businessBanners = [
    {
      id: "fallback-business-1",
      title: "Grow Your Business",
      description: "Join our network of trusted local businesses and reach more customers in your area",
      image_url: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1200&h=300&q=80",
      type: "business",
      format: "banner",
      reference_id: "business-network",
      status: "active",
      user_id: "system",
      budget: 1000,
      location: "Global",
      impressions: 2500,
      clicks: 180,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      video_url: null,
      carousel_images: null
    },
    {
      id: "fallback-business-2",
      title: "Business Directory",
      description: "List your business in our premium directory and get discovered by potential customers",
      image_url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&h=300&q=80",
      type: "business",
      format: "banner",
      reference_id: "business-directory",
      status: "active",
      user_id: "system",
      budget: 900,
      location: "Global",
      impressions: 2200,
      clicks: 145,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      video_url: null,
      carousel_images: null
    }
  ];
  
  // Return appropriate fallback ads based on type
  if (type === "service") {
    return serviceBanners;
  } else if (type === "business") {
    return businessBanners;
  } else {
    return genericBanners;
  }
};
