
import { supabase } from "@/integrations/supabase/client";
import { RankingMetrics } from "@/types/subscription";

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
      // For wishlist count, we'd need to count from the wishlists table
      const { data: wishlistCountData } = await supabase
        .from("wishlists")
        .select("product_id, count")
        .select("product_id, count(*)", { count: "exact" })
        .order("count", { ascending: false })
        .limit(limit);

      // Transform wishlist counts to product IDs array
      const productIds = wishlistCountData?.map(item => item.product_id) || [];
      
      // Now fetch those products
      if (productIds.length > 0) {
        query = query.in("id", productIds);
      }
    } else if (sortBy === "sales") {
      // For sales count, we'd need to join with orders
      const { data: salesCountData } = await supabase
        .from("order_items")
        .select("product_id, count")
        .select("product_id, count(*)", { count: "exact" })
        .order("count", { ascending: false })
        .limit(limit);

      // Transform sales counts to product IDs array  
      const productIds = salesCountData?.map(item => item.product_id) || [];
      
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
      badge: getBadgeForRank(index + 1, sortBy)
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
      // For booking count, we need to get appointment counts
      const { data: bookingCountData } = await supabase
        .from("appointments")
        .select("service_name, count")
        .select("service_name, count(*)", { count: "exact" })
        .order("count", { ascending: false })
        .limit(limit);

      // Transform booking counts to service IDs array
      const serviceIds = bookingCountData?.map(item => item.service_name) || [];
      
      // Now fetch those services
      if (serviceIds.length > 0) {
        query = query.in("id", serviceIds);
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
      badge: getBadgeForRank(index + 1, sortBy)
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
      .select("business_id, page_views")
      .order("page_views", { ascending: false })
      .limit(limit);

    if (analyticsError) {
      throw analyticsError;
    }

    // Transform to business IDs array
    const businessIds = analyticsData?.map(item => item.business_id) || [];
    
    // Fetch those businesses
    if (businessIds.length > 0) {
      query = query.in("id", businessIds);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform and add rank and views from analytics
    return (data || []).map((business, index) => {
      const analytics = analyticsData?.find(a => a.business_id === business.id);
      return {
        ...business,
        rank: index + 1,
        badge: getBadgeForRank(index + 1, sortBy),
        views: analytics?.page_views || 0
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
