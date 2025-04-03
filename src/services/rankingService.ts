
import { supabase } from "@/integrations/supabase/client";
import { RankingMetrics } from "@/types/subscription";

export type RankingType = "views" | "wishlist" | "sales" | "bookings";

export const getProductRankings = async (
  sortBy: "views" | "wishlists" | "sales" = "views",
  limit: number = 10
): Promise<RankingMetrics[]> => {
  try {
    let query = supabase
      .from("products")
      .select("id, title, description, price, image_url, category, views");

    if (sortBy === "views") {
      query = query.order("views", { ascending: false });
    } else if (sortBy === "wishlists") {
      // For wishlist count, we need a different approach since count() isn't working
      const { data: wishlistData } = await supabase
        .from("wishlists")
        .select("product_id");
        
      // Count occurrences of each product_id
      const wishlistCounts: Record<string, number> = {};
      wishlistData?.forEach(item => {
        wishlistCounts[item.product_id] = (wishlistCounts[item.product_id] || 0) + 1;
      });
      
      // Get product IDs sorted by count
      const productIds = Object.entries(wishlistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);
      
      // Now fetch those products
      if (productIds.length > 0) {
        query = query.in("id", productIds);
      }
    } else if (sortBy === "sales") {
      // For sales count, similar approach
      const { data: salesData } = await supabase
        .from("orders")
        .select("product_id");
        
      // Count occurrences
      const salesCounts: Record<string, number> = {};
      salesData?.forEach(item => {
        salesCounts[item.product_id] = (salesCounts[item.product_id] || 0) + 1;
      });
      
      // Get product IDs sorted by count
      const productIds = Object.entries(salesCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);
      
      // Now fetch those products
      if (productIds.length > 0) {
        query = query.in("id", productIds);
      }
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform and add rank
    return (data || []).map((product, index) => ({
      ...product,
      rank: index + 1,
      badge: getBadgeForRank(index + 1, sortBy),
      score: product.views || 0 // Add score property (same as views in this case)
    }));
  } catch (error) {
    console.error("Error fetching product rankings:", error);
    return [];
  }
};

export const getServiceRankings = async (
  sortBy: "views" | "bookings" = "views",
  limit: number = 10
): Promise<RankingMetrics[]> => {
  try {
    let query = supabase
      .from("services")
      .select("id, title, description, price, image_url, category, views");

    if (sortBy === "views") {
      query = query.order("views", { ascending: false });
    } else if (sortBy === "bookings") {
      // For booking count, we need to work around the count issue
      const { data: bookingData } = await supabase
        .from("appointments")
        .select("*");

      // Group appointments by service name and count
      const serviceNameCounts: Record<string, number> = {};
      bookingData?.forEach(appointment => {
        if (appointment.service_name) {
          serviceNameCounts[appointment.service_name] = 
            (serviceNameCounts[appointment.service_name] || 0) + 1;
        }
      });
      
      // Get unique service names sorted by count
      const serviceNames = Object.entries(serviceNameCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      // Now fetch services that match these names
      if (serviceNames.length > 0) {
        query = query.in("title", serviceNames);
      }
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform and add rank
    return (data || []).map((service, index) => ({
      ...service,
      rank: index + 1,
      badge: getBadgeForRank(index + 1, sortBy),
      score: service.views || 0 // Add score property
    }));
  } catch (error) {
    console.error("Error fetching service rankings:", error);
    return [];
  }
};

export const getBusinessRankings = async (
  sortBy: "views" = "views",
  limit: number = 10
): Promise<RankingMetrics[]> => {
  try {
    let query = supabase
      .from("businesses")
      .select("id, name, description, image_url, category, location");

    // Get business_analytics for views count
    const { data: analyticsData, error: analyticsError } = await supabase
      .from("business_analytics")
      .select("business_id, page_views");

    if (analyticsError) {
      throw analyticsError;
    }

    // Transform to business IDs array
    const businessIds = analyticsData?.map(item => item.business_id) || [];
    
    // Fetch those businesses
    if (businessIds.length > 0) {
      query = query.in("id", businessIds);
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform and add rank and views from analytics
    return (data || []).map((business, index) => {
      const analytics = analyticsData?.find(a => a.business_id === business.id);
      return {
        ...business,
        title: business.name, // Add title alias for name
        rank: index + 1,
        badge: getBadgeForRank(index + 1, sortBy),
        views: analytics?.page_views || 0,
        score: analytics?.page_views || 0, // Add score property
        price: 0 // Add dummy price for compatibility
      };
    });
  } catch (error) {
    console.error("Error fetching business rankings:", error);
    return [];
  }
};

// Helper for badge text and styling
const getBadgeForRank = (rank: number, metric: string): string => {
  if (rank === 1) return "🏆 Top Rated";
  if (rank === 2) return "🥈 Runner Up";
  if (rank === 3) return "🥉 3rd Place";
  if (rank <= 10) return "⭐ Top 10";
  
  switch (metric) {
    case "views":
      return "👁️ Trending";
    case "wishlists":
      return "❤️ Most Wanted";
    case "sales":
      return "🔥 Best Seller";
    case "bookings":
      return "📅 Most Booked";
    default:
      return "Popular";
  }
};

// Add getTrendingProducts function
export const getTrendingProducts = async (limit: number = 8): Promise<RankingMetrics[]> => {
  return getProductRankings("views", limit);
};

// Add getTopSellingProducts function
export const getTopSellingProducts = async (limit: number = 8): Promise<RankingMetrics[]> => {
  return getProductRankings("sales", limit);
};

// Add getMostWishlistedProducts function
export const getMostWishlistedProducts = async (limit: number = 8): Promise<RankingMetrics[]> => {
  return getProductRankings("wishlists", limit);
};
