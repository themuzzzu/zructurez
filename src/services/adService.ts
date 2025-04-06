
export type AdType = 'product' | 'business' | 'service';
export type AdFormat = 'banner' | 'card' | 'featured' | 'sponsored';

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  business_id?: string;
  type: AdType;
  reference_id: string;
  budget?: number;
  format?: AdFormat;
  status?: 'pending' | 'active' | 'paused' | 'completed';
  impressions?: number;
  clicks?: number;
  conversions?: number;
  reach?: number;
  ctr?: number;
  start_date?: string;
  end_date?: string;
  target_demographic?: any;
  target_location?: string;
}

// Sample advertisement data
const sampleAds: Record<AdType, Advertisement[]> = {
  product: [
    {
      id: "product-ad-1",
      title: "New Summer Collection",
      description: "Explore our latest summer fashion collection with up to 50% off",
      type: "product",
      reference_id: "summer-collection",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=300&q=80",
    },
    {
      id: "product-ad-2",
      title: "Tech Gadgets Sale",
      description: "Latest smartphones and gadgets at unbeatable prices",
      type: "product",
      reference_id: "tech-sale",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&h=300&q=80",
    }
  ],
  business: [
    {
      id: "business-ad-1",
      title: "Visit Our New Location",
      description: "We've opened a new store downtown. Visit us today!",
      type: "business",
      reference_id: "downtown-store",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=300&q=80",
    },
    {
      id: "business-ad-2",
      title: "Award-Winning Restaurant",
      description: "Experience fine dining with our award-winning chefs",
      type: "business",
      reference_id: "fine-dining",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&h=300&q=80",
    }
  ],
  service: [
    {
      id: "service-ad-1",
      title: "Home Cleaning Services",
      description: "Professional house cleaning with trusted experts. Book today!",
      type: "service",
      reference_id: "cleaning-services",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&h=300&q=80",
    },
    {
      id: "service-banner-2",
      title: "Plumbing Solutions",
      description: "Expert plumbing repairs and installations. Available 24/7 for emergencies.",
      type: "service",
      reference_id: "plumbing-services",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1606321022034-31968bb41e4c?auto=format&fit=crop&w=800&h=300&q=80",
    },
    {
      id: "service-banner-3",
      title: "Interior Design",
      description: "Transform your space with professional design services",
      type: "service",
      reference_id: "interior-design",
      status: "active",
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&h=300&q=80",
    }
  ]
};

/**
 * Fetch active advertisements by type and format
 * @param adType Type of advertisement (product, business, service)
 * @param adFormat Format of advertisement (banner, card)
 * @param limit Maximum number of ads to return
 * @returns Promise resolving to an array of advertisements
 */
export const fetchActiveAds = async (
  adType: AdType,
  adFormat: AdFormat = 'banner',
  limit: number = 1
): Promise<Advertisement[]> => {
  try {
    // In a real app, this would fetch from an API or database
    // For now, we'll return sample data
    const adsForType = sampleAds[adType] || [];
    
    // Filter by format if specified
    const filteredAds = adFormat 
      ? adsForType.filter(ad => ad.format === adFormat || !ad.format)
      : adsForType;
    
    // Limit the number of results
    return filteredAds.slice(0, limit);
  } catch (error) {
    console.error(`Error fetching ${adType} ads:`, error);
    return [];
  }
};

/**
 * Increment ad view count
 * @param adId Advertisement ID
 * @returns Promise resolving to the updated view count
 */
export const incrementAdView = async (adId: string): Promise<number> => {
  try {
    // In a real implementation, this would call an API to increment the view
    // For demonstration, we'll simulate counting the view
    console.log(`Ad view recorded for ad ${adId}`);
    
    return 1; // Return a simulated count
  } catch (error) {
    console.error("Error incrementing ad view:", error);
    return 0;
  }
};

/**
 * Increment ad click count
 * @param adId Advertisement ID
 * @returns Promise resolving to the updated click count
 */
export const incrementAdClick = async (adId: string): Promise<number> => {
  try {
    // In a real implementation, this would call an API to increment the click
    // For demonstration, we'll simulate counting the click
    console.log(`Ad click recorded for ad ${adId}`);
    
    return 1; // Return a simulated count
  } catch (error) {
    console.error("Error incrementing ad click:", error);
    return 0;
  }
};

/**
 * Increment ad conversion count
 * @param adId Advertisement ID
 * @returns Promise resolving to the updated conversion count
 */
export const incrementAdConversion = async (adId: string): Promise<number> => {
  try {
    // In a real implementation, this would call an API to increment the conversion
    console.log(`Ad conversion recorded for ad ${adId}`);
    
    return 1; // Return a simulated count
  } catch (error) {
    console.error("Error incrementing ad conversion:", error);
    return 0;
  }
};
