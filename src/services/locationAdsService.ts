
import { supabase } from '@/integrations/supabase/client';
import { Advertisement } from './adService';

export interface LocationBasedAd extends Advertisement {
  city?: string;
  latitude?: number;
  longitude?: number;
  target_radius?: number; // in kilometers
  target_demographics?: string[];
  local_business_id?: string;
  distance_km?: number;
}

export interface AdFilters {
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  adType?: string;
  category?: string;
  demographics?: string[];
}

/**
 * Get location-based advertisements
 */
export const getLocationBasedAds = async (
  filters: AdFilters,
  limit: number = 10
): Promise<LocationBasedAd[]> => {
  try {
    let query = supabase
      .from('advertisements')
      .select(`
        *,
        businesses:local_business_id (
          business_name,
          city,
          latitude,
          longitude
        )
      `)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .lte('start_date', new Date().toISOString());

    // Location filtering
    if (filters.city) {
      query = query.or(`city.ilike.%${filters.city}%,businesses.city.ilike.%${filters.city}%`);
    }

    // Ad type filtering
    if (filters.adType && filters.adType !== 'all') {
      query = query.eq('type', filters.adType);
    }

    // Order by budget (higher budget ads shown first)
    query = query.order('budget', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching location-based ads:', error);
      return [];
    }

    if (!data) return [];

    // Transform and calculate distance
    const adsWithDistance = data.map((ad: any) => {
      let distance_km: number | undefined;

      // Calculate distance if coordinates are provided
      if (filters.latitude && filters.longitude) {
        const adLat = ad.latitude || ad.businesses?.latitude;
        const adLng = ad.longitude || ad.businesses?.longitude;
        
        if (adLat && adLng) {
          distance_km = calculateDistance(
            filters.latitude,
            filters.longitude,
            adLat,
            adLng
          );
        }
      }

      return {
        ...ad,
        city: ad.city || ad.businesses?.city,
        distance_km
      };
    });

    // Filter by radius if specified
    let filteredAds = adsWithDistance;
    if (filters.radius && filters.latitude && filters.longitude) {
      filteredAds = adsWithDistance.filter(ad => 
        !ad.distance_km || ad.distance_km <= filters.radius!
      );
    }

    // Sort by distance if available, otherwise by budget
    filteredAds.sort((a, b) => {
      if (a.distance_km !== undefined && b.distance_km !== undefined) {
        return a.distance_km - b.distance_km;
      }
      return b.budget - a.budget;
    });

    return filteredAds.slice(0, limit);

  } catch (error) {
    console.error('Error in getLocationBasedAds:', error);
    return [];
  }
};

/**
 * Get banner ads for a specific location
 */
export const getBannerAdsForLocation = async (
  city: string,
  limit: number = 3
): Promise<LocationBasedAd[]> => {
  const filters: AdFilters = {
    city,
    adType: 'banner'
  };
  
  return await getLocationBasedAds(filters, limit);
};

/**
 * Get product promotion ads in a location
 */
export const getProductAdsForLocation = async (
  city: string,
  category?: string,
  limit: number = 5
): Promise<LocationBasedAd[]> => {
  try {
    let query = supabase
      .from('advertisements')
      .select(`
        *,
        products:reference_id (
          name,
          category,
          price,
          image_url
        ),
        businesses:local_business_id (
          business_name,
          city
        )
      `)
      .eq('status', 'active')
      .eq('type', 'product')
      .gte('end_date', new Date().toISOString())
      .lte('start_date', new Date().toISOString());

    // Location filtering
    if (city) {
      query = query.or(`city.ilike.%${city}%,businesses.city.ilike.%${city}%`);
    }

    // Category filtering through referenced product
    if (category) {
      query = query.eq('products.category', category);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching product ads:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Error in getProductAdsForLocation:', error);
    return [];
  }
};

/**
 * Get service promotion ads in a location
 */
export const getServiceAdsForLocation = async (
  city: string,
  category?: string,
  limit: number = 5
): Promise<LocationBasedAd[]> => {
  try {
    let query = supabase
      .from('advertisements')
      .select(`
        *,
        services:reference_id (
          title,
          category,
          price,
          image_url
        ),
        businesses:local_business_id (
          business_name,
          city
        )
      `)
      .eq('status', 'active')
      .eq('type', 'service')
      .gte('end_date', new Date().toISOString())
      .lte('start_date', new Date().toISOString());

    // Location filtering
    if (city) {
      query = query.or(`city.ilike.%${city}%,businesses.city.ilike.%${city}%`);
    }

    // Category filtering through referenced service
    if (category) {
      query = query.eq('services.category', category);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching service ads:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Error in getServiceAdsForLocation:', error);
    return [];
  }
};

/**
 * Track ad impression
 */
export const trackAdImpression = async (
  adId: string,
  userLocation?: { city?: string; latitude?: number; longitude?: number }
): Promise<void> => {
  try {
    // Increment impressions count
    const { error: updateError } = await supabase
      .from('advertisements')
      .update({ 
        impressions: supabase.sql`impressions + 1`
      })
      .eq('id', adId);

    if (updateError) {
      console.error('Error updating ad impressions:', updateError);
      return;
    }

    // Track detailed impression data
    const { error: trackError } = await supabase
      .from('ad_impressions')
      .insert([
        {
          ad_id: adId,
          user_city: userLocation?.city,
          user_latitude: userLocation?.latitude,
          user_longitude: userLocation?.longitude,
          timestamp: new Date().toISOString()
        }
      ]);

    if (trackError) {
      console.error('Error tracking ad impression:', trackError);
    }

  } catch (error) {
    console.error('Error in trackAdImpression:', error);
  }
};

/**
 * Track ad click
 */
export const trackAdClick = async (
  adId: string,
  userLocation?: { city?: string; latitude?: number; longitude?: number }
): Promise<void> => {
  try {
    // Increment clicks count
    const { error: updateError } = await supabase
      .from('advertisements')
      .update({ 
        clicks: supabase.sql`clicks + 1`
      })
      .eq('id', adId);

    if (updateError) {
      console.error('Error updating ad clicks:', updateError);
      return;
    }

    // Track detailed click data
    const { error: trackError } = await supabase
      .from('ad_clicks')
      .insert([
        {
          ad_id: adId,
          user_city: userLocation?.city,
          user_latitude: userLocation?.latitude,
          user_longitude: userLocation?.longitude,
          timestamp: new Date().toISOString()
        }
      ]);

    if (trackError) {
      console.error('Error tracking ad click:', trackError);
    }

  } catch (error) {
    console.error('Error in trackAdClick:', error);
  }
};

/**
 * Get ad performance analytics by location
 */
export const getAdPerformanceByLocation = async (
  adId: string
): Promise<{
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
  topCities: Array<{ city: string; impressions: number; clicks: number }>;
}> => {
  try {
    // Get total impressions and clicks
    const { data: adData } = await supabase
      .from('advertisements')
      .select('impressions, clicks')
      .eq('id', adId)
      .single();

    // Get impressions by city
    const { data: cityImpressions } = await supabase
      .from('ad_impressions')
      .select('user_city')
      .eq('ad_id', adId)
      .not('user_city', 'is', null);

    // Get clicks by city
    const { data: cityClicks } = await supabase
      .from('ad_clicks')
      .select('user_city')
      .eq('ad_id', adId)
      .not('user_city', 'is', null);

    // Aggregate city data
    const cityStats: { [city: string]: { impressions: number; clicks: number } } = {};

    cityImpressions?.forEach((impression: any) => {
      const city = impression.user_city;
      if (!cityStats[city]) cityStats[city] = { impressions: 0, clicks: 0 };
      cityStats[city].impressions += 1;
    });

    cityClicks?.forEach((click: any) => {
      const city = click.user_city;
      if (!cityStats[city]) cityStats[city] = { impressions: 0, clicks: 0 };
      cityStats[city].clicks += 1;
    });

    const topCities = Object.entries(cityStats)
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10);

    const totalImpressions = adData?.impressions || 0;
    const totalClicks = adData?.clicks || 0;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      ctr,
      topCities
    };

  } catch (error) {
    console.error('Error getting ad performance by location:', error);
    return {
      totalImpressions: 0,
      totalClicks: 0,
      ctr: 0,
      topCities: []
    };
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
