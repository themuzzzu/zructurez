
import { supabase } from "@/integrations/supabase/client";

// Ranking types for different metrics
export type RankingType = "views" | "wishlist" | "sales";
export type EntityType = "product" | "service" | "business";

export interface RankingMetrics {
  id: string;
  score: number;
  title?: string;
  name?: string;
  image_url?: string;
  views?: number;
  wishlist_count?: number;
  sales_count?: number;
  price?: number;
  rank?: number;
  badge?: string;
}

/**
 * Fetch rankings for products based on different metrics
 * @param type The type of ranking (views, wishlist, sales)
 * @param limit Number of items to return
 * @returns Array of ranked products with metrics
 */
export const getProductRankings = async (
  type: RankingType = "views",
  limit: number = 10
): Promise<RankingMetrics[]> => {
  try {
    let query = supabase.from("products").select(`
      id, 
      title,
      price,
      image_url,
      views,
      category
    `);

    // Order by the selected metric
    if (type === "views") {
      query = query.order("views", { ascending: false });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    // If ranking by wishlist counts, we need to get additional data
    if (type === "wishlist" && data) {
      // Get wishlist counts for each product
      const productIds = data.map(product => product.id);
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlists")
        .select("product_id, count")
        .in("product_id", productIds)
        .group("product_id");

      if (wishlistError) throw wishlistError;

      // Create a map of product_id to wishlist count
      const wishlistCounts = new Map();
      if (wishlistData) {
        wishlistData.forEach(item => {
          wishlistCounts.set(item.product_id, parseInt(item.count));
        });
      }

      // Merge wishlist data with products
      const productsWithWishlist = data.map(product => ({
        ...product,
        wishlist_count: wishlistCounts.get(product.id) || 0
      }));

      // Sort by wishlist count
      productsWithWishlist.sort((a, b) => 
        (b.wishlist_count || 0) - (a.wishlist_count || 0)
      );

      // Add rank and apply badges
      return productsWithWishlist.map((product, index) => ({
        ...product,
        score: product.wishlist_count || 0,
        rank: index + 1,
        badge: getBadgeForRank(index)
      }));
    }

    // If ranking by sales
    if (type === "sales" && data) {
      // Get sales data from orders table
      const productIds = data.map(product => product.id);
      const { data: salesData, error: salesError } = await supabase
        .from("orders")
        .select("product_id, count")
        .in("product_id", productIds)
        .eq("status", "completed")
        .group("product_id");

      if (salesError) throw salesError;

      // Create a map of product_id to sales count
      const salesCounts = new Map();
      if (salesData) {
        salesData.forEach(item => {
          salesCounts.set(item.product_id, parseInt(item.count));
        });
      }

      // Merge sales data with products
      const productsWithSales = data.map(product => ({
        ...product,
        sales_count: salesCounts.get(product.id) || 0
      }));

      // Sort by sales count
      productsWithSales.sort((a, b) => 
        (b.sales_count || 0) - (a.sales_count || 0)
      );

      // Add rank and apply badges
      return productsWithSales.map((product, index) => ({
        ...product,
        score: product.sales_count || 0,
        rank: index + 1,
        badge: getBadgeForRank(index)
      }));
    }

    // Default case - ranking by views
    return data.map((product, index) => ({
      ...product,
      score: product.views || 0,
      rank: index + 1,
      badge: getBadgeForRank(index)
    }));
  } catch (error) {
    console.error("Error fetching product rankings:", error);
    return [];
  }
};

/**
 * Fetch rankings for services based on different metrics
 * @param type The type of ranking (views, wishlist)
 * @param limit Number of items to return
 * @returns Array of ranked services with metrics
 */
export const getServiceRankings = async (
  type: RankingType = "views",
  limit: number = 10
): Promise<RankingMetrics[]> => {
  try {
    let query = supabase.from("services").select(`
      id, 
      title,
      price,
      image_url,
      views,
      category
    `);

    // Order by the selected metric
    if (type === "views") {
      query = query.order("views", { ascending: false });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    // For services, we mainly rely on views since wishlist and sales don't apply directly
    return data.map((service, index) => ({
      ...service,
      score: service.views || 0,
      rank: index + 1,
      badge: getBadgeForRank(index)
    }));
  } catch (error) {
    console.error("Error fetching service rankings:", error);
    return [];
  }
};

/**
 * Fetch rankings for businesses based on different metrics
 * @param type The type of ranking (views, followers)
 * @param limit Number of items to return
 * @returns Array of ranked businesses with metrics
 */
export const getBusinessRankings = async (
  type: RankingType = "views",
  limit: number = 10
): Promise<RankingMetrics[]> => {
  try {
    // For businesses, we use the business_analytics table for view counts
    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .select(`
        id, 
        name,
        image_url,
        category
      `)
      .limit(limit);

    if (businessError) throw businessError;

    if (!businessData || businessData.length === 0) {
      return [];
    }

    // Get view counts for each business
    const businessIds = businessData.map(business => business.id);
    const { data: analyticsData, error: analyticsError } = await supabase
      .from("business_analytics")
      .select("business_id, page_views")
      .in("business_id", businessIds);

    if (analyticsError) throw analyticsError;

    // Create a map of business_id to view count
    const viewCounts = new Map();
    if (analyticsData) {
      analyticsData.forEach(item => {
        viewCounts.set(item.business_id, item.page_views || 0);
      });
    }

    // Merge analytics data with businesses
    const businessesWithViews = businessData.map(business => ({
      ...business,
      views: viewCounts.get(business.id) || 0
    }));

    // Sort by view count
    businessesWithViews.sort((a, b) => 
      (b.views || 0) - (a.views || 0)
    );

    // Add rank and apply badges
    return businessesWithViews.map((business, index) => ({
      ...business,
      title: business.name, // Standardize the field name
      score: business.views || 0,
      rank: index + 1,
      badge: getBadgeForRank(index)
    }));
  } catch (error) {
    console.error("Error fetching business rankings:", error);
    return [];
  }
};

/**
 * Get a badge label based on rank position
 * @param index The zero-based index in the ranking
 * @returns Badge text appropriate for the rank
 */
const getBadgeForRank = (index: number): string => {
  if (index === 0) return "Top Ranked";
  if (index === 1) return "Hot";
  if (index === 2) return "Trending";
  if (index < 5) return "Rising";
  if (index < 10) return "Popular";
  return "";
};

/**
 * Get trending products for display with appropriate badges
 * @param limit Number of products to return
 * @returns Array of trending products with ranking badges
 */
export const getTrendingProducts = async (limit: number = 8): Promise<RankingMetrics[]> => {
  try {
    // This is a simplified approach that combines views, wishlist, and sales
    const viewsRanked = await getProductRankings("views", limit);
    
    // Add trend indicator based on ranking
    return viewsRanked.map(product => {
      let trendIndicator = "";
      if (product.rank === 1) trendIndicator = "Top Ranked";
      else if (product.rank <= 3) trendIndicator = "Trending";
      else if (product.rank <= 5) trendIndicator = "Popular";
      
      return {
        ...product,
        badge: trendIndicator || product.badge
      };
    });
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }
};

/**
 * Get top-selling products
 * @param limit Number of products to return
 * @returns Array of top-selling products with badges
 */
export const getTopSellingProducts = async (limit: number = 8): Promise<RankingMetrics[]> => {
  return getProductRankings("sales", limit);
};

/**
 * Get most wishlisted products
 * @param limit Number of products to return
 * @returns Array of most wishlisted products with badges
 */
export const getMostWishlistedProducts = async (limit: number = 8): Promise<RankingMetrics[]> => {
  return getProductRankings("wishlist", limit);
};
