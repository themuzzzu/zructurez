
import { supabase } from '@/integrations/supabase/client';

export interface LocationBasedFilters {
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popularity' | 'distance';
}

export interface LocationBasedProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  city?: string;
  business_name?: string;
  business_city?: string;
  location_type: 'direct-product' | 'business-location' | 'fallback';
  distance_km?: number;
  image_url?: string;
  category?: string;
  is_active?: boolean;
  stock_quantity?: number;
  created_at: string;
}

export interface LocationBasedService {
  id: string;
  title: string;
  description?: string;
  price: number;
  city?: string;
  business_name?: string;
  business_city?: string;
  location_type: 'direct-service' | 'business-location' | 'fallback';
  distance_km?: number;
  image_url?: string;
  category?: string;
  is_available?: boolean;
  created_at: string;
}

export interface LocationBasedBusiness {
  id: string;
  business_name: string;
  city?: string;
  category?: string;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  distance_km?: number;
  avg_rating?: number;
  review_count?: number;
  latitude?: number;
  longitude?: number;
}

/**
 * Get products filtered by location with business fallback
 */
export const getProductsByLocation = async (
  filters: LocationBasedFilters
): Promise<LocationBasedProduct[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        businesses:business_id (
          business_name,
          city,
          latitude,
          longitude,
          is_active
        )
      `);

    // Location filtering
    if (filters.city) {
      query = query.or(`city.ilike.%${filters.city}%,businesses.city.ilike.%${filters.city}%`);
    }

    // Category filtering
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Price filtering
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    // Active status filters
    query = query.or('is_active.is.null,is_active.eq.true');

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popularity':
        query = query.order('views_count', { ascending: false, nullsLast: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching location-based products:', error);
      return [];
    }

    if (!data) return [];

    // Transform and calculate distance if coordinates are provided
    return data.map((product: any) => {
      let distance_km: number | undefined;
      let location_type: 'direct-product' | 'business-location' | 'fallback' = 'fallback';

      // Determine location type and calculate distance
      if (product.city && filters.city && 
          product.city.toLowerCase().includes(filters.city.toLowerCase())) {
        location_type = 'direct-product';
      } else if (product.businesses?.city && filters.city && 
                 product.businesses.city.toLowerCase().includes(filters.city.toLowerCase())) {
        location_type = 'business-location';
      }

      // Calculate distance if coordinates are provided
      if (filters.latitude && filters.longitude) {
        const productLat = product.latitude || product.businesses?.latitude;
        const productLng = product.longitude || product.businesses?.longitude;
        
        if (productLat && productLng) {
          distance_km = calculateDistance(
            filters.latitude,
            filters.longitude,
            productLat,
            productLng
          );
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        city: product.city,
        business_name: product.businesses?.business_name,
        business_city: product.businesses?.city,
        location_type,
        distance_km,
        image_url: product.image_url,
        category: product.category,
        is_active: product.is_active,
        stock_quantity: product.stock_quantity,
        created_at: product.created_at
      };
    });

  } catch (error) {
    console.error('Error in getProductsByLocation:', error);
    return [];
  }
};

/**
 * Get services filtered by location with business fallback
 */
export const getServicesByLocation = async (
  filters: LocationBasedFilters
): Promise<LocationBasedService[]> => {
  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        businesses:business_id (
          business_name,
          city,
          latitude,
          longitude,
          is_active
        )
      `);

    // Location filtering
    if (filters.city) {
      query = query.or(`city.ilike.%${filters.city}%,businesses.city.ilike.%${filters.city}%`);
    }

    // Category filtering
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Price filtering
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    // Active status filters
    query = query.or('is_available.is.null,is_available.eq.true');

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popularity':
        query = query.order('views_count', { ascending: false, nullsLast: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching location-based services:', error);
      return [];
    }

    if (!data) return [];

    // Transform and calculate distance if coordinates are provided
    return data.map((service: any) => {
      let distance_km: number | undefined;
      let location_type: 'direct-service' | 'business-location' | 'fallback' = 'fallback';

      // Determine location type
      if (service.city && filters.city && 
          service.city.toLowerCase().includes(filters.city.toLowerCase())) {
        location_type = 'direct-service';
      } else if (service.businesses?.city && filters.city && 
                 service.businesses.city.toLowerCase().includes(filters.city.toLowerCase())) {
        location_type = 'business-location';
      }

      // Calculate distance if coordinates are provided
      if (filters.latitude && filters.longitude) {
        const serviceLat = service.latitude || service.businesses?.latitude;
        const serviceLng = service.longitude || service.businesses?.longitude;
        
        if (serviceLat && serviceLng) {
          distance_km = calculateDistance(
            filters.latitude,
            filters.longitude,
            serviceLat,
            serviceLng
          );
        }
      }

      return {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        city: service.city,
        business_name: service.businesses?.business_name,
        business_city: service.businesses?.city,
        location_type,
        distance_km,
        image_url: service.image_url,
        category: service.category,
        is_available: service.is_available,
        created_at: service.created_at
      };
    });

  } catch (error) {
    console.error('Error in getServicesByLocation:', error);
    return [];
  }
};

/**
 * Get businesses filtered by location
 */
export const getBusinessesByLocation = async (
  filters: LocationBasedFilters
): Promise<LocationBasedBusiness[]> => {
  try {
    let query = supabase
      .from('businesses')
      .select(`
        *,
        reviews:reviews (rating)
      `);

    // Location filtering
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    // Category filtering
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Active status filter
    query = query.or('is_active.is.null,is_active.eq.true');

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching location-based businesses:', error);
      return [];
    }

    if (!data) return [];

    // Transform and calculate metrics
    return data.map((business: any) => {
      let distance_km: number | undefined;
      let avg_rating: number | undefined;
      let review_count = 0;

      // Calculate distance if coordinates are provided
      if (filters.latitude && filters.longitude && business.latitude && business.longitude) {
        distance_km = calculateDistance(
          filters.latitude,
          filters.longitude,
          business.latitude,
          business.longitude
        );
      }

      // Calculate average rating
      if (business.reviews && business.reviews.length > 0) {
        const ratings = business.reviews.map((r: any) => r.rating).filter((r: number) => r > 0);
        if (ratings.length > 0) {
          avg_rating = ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length;
          review_count = ratings.length;
        }
      }

      return {
        id: business.id,
        business_name: business.business_name || business.name,
        city: business.city,
        category: business.category,
        description: business.description,
        image_url: business.image_url,
        is_active: business.is_active,
        distance_km,
        avg_rating,
        review_count,
        latitude: business.latitude,
        longitude: business.longitude
      };
    }).sort((a, b) => {
      // Sort by distance if available, otherwise by rating
      if (a.distance_km !== undefined && b.distance_km !== undefined) {
        return a.distance_km - b.distance_km;
      }
      if (a.avg_rating && b.avg_rating) {
        return b.avg_rating - a.avg_rating;
      }
      return 0;
    });

  } catch (error) {
    console.error('Error in getBusinessesByLocation:', error);
    return [];
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

/**
 * Get trending products in a specific location
 */
export const getTrendingProductsByLocation = async (
  city: string,
  limit: number = 20
): Promise<LocationBasedProduct[]> => {
  const filters: LocationBasedFilters = {
    city,
    sortBy: 'popularity'
  };
  
  const products = await getProductsByLocation(filters);
  return products.slice(0, limit);
};

/**
 * Get discounted products in a specific location
 */
export const getDiscountedProductsByLocation = async (
  city: string,
  limit: number = 20
): Promise<LocationBasedProduct[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        businesses:business_id (
          business_name,
          city,
          is_active
        )
      `)
      .or(`city.ilike.%${city}%,businesses.city.ilike.%${city}%`)
      .or('is_discounted.eq.true,discount_percentage.gt.0')
      .or('is_active.is.null,is_active.eq.true')
      .order('discount_percentage', { ascending: false, nullsLast: true })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching discounted products:', error);
      return [];
    }

    if (!data) return [];

    return data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      city: product.city,
      business_name: product.businesses?.business_name,
      business_city: product.businesses?.city,
      location_type: product.city ? 'direct-product' : 'business-location',
      image_url: product.image_url,
      category: product.category,
      is_active: product.is_active,
      stock_quantity: product.stock_quantity,
      created_at: product.created_at
    }));

  } catch (error) {
    console.error('Error in getDiscountedProductsByLocation:', error);
    return [];
  }
};
