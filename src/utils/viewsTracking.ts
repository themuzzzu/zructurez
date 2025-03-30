
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Increments the view count for a specific entity
 * @param entityType The type of entity ('product', 'business', 'service', 'post')
 * @param entityId The UUID of the entity
 */
export const incrementViewCount = async (
  entityType: 'product' | 'business' | 'service' | 'post',
  entityId: string
): Promise<void> => {
  try {
    // Check if user has viewed this entity in the last hour (to prevent spam)
    const sessionKey = `viewed_${entityType}_${entityId}`;
    const lastViewed = localStorage.getItem(sessionKey);
    
    if (lastViewed) {
      const lastViewedTime = parseInt(lastViewed, 10);
      const oneHourAgo = Date.now() - 3600000; // 1 hour in milliseconds
      
      if (lastViewedTime > oneHourAgo) {
        // User has viewed this entity within the last hour
        return;
      }
    }
    
    // Mark this entity as viewed in this session
    localStorage.setItem(sessionKey, Date.now().toString());
    
    // Increment the view count based on entity type
    let { error } = await supabase.rpc(
      `increment_${entityType}_views`,
      { [`${entityType}_id_param`]: entityId }
    );
    
    if (error) {
      console.error(`Error incrementing ${entityType} views:`, error);
    }
  } catch (error) {
    console.error(`Failed to increment ${entityType} view:`, error);
  }
};

/**
 * Hook to fetch analytics data for a business owner
 * @param userId The user ID of the business owner
 * @returns Analytics data for the dashboard
 */
export const fetchBusinessAnalytics = async (userId: string | undefined) => {
  if (!userId) return null;
  
  try {
    // Fetch business ID
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (businessError || !businessData) {
      return null;
    }
    
    const businessId = businessData.id;
    
    // Fetch business analytics
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('business_analytics')
      .select('*')
      .eq('business_id', businessId)
      .single();
      
    if (analyticsError) {
      console.error('Error fetching business analytics:', analyticsError);
      return null;
    }
    
    // Fetch product view counts
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, views')
      .eq('user_id', userId)
      .order('views', { ascending: false });
      
    if (productsError) {
      console.error('Error fetching product analytics:', productsError);
    }
    
    // Fetch service view counts
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, title, views')
      .eq('user_id', userId)
      .order('views', { ascending: false });
      
    if (servicesError) {
      console.error('Error fetching service analytics:', servicesError);
    }
    
    // Fetch post view counts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content, views')
      .eq('user_id', userId)
      .order('views', { ascending: false });
      
    if (postsError) {
      console.error('Error fetching post analytics:', postsError);
    }
    
    // Return combined analytics data
    return {
      businessViews: analyticsData?.page_views || 0,
      productAnalytics: products || [],
      serviceAnalytics: services || [],
      postAnalytics: posts || [],
      lastUpdated: analyticsData?.last_updated || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in fetchBusinessAnalytics:', error);
    return null;
  }
};

/**
 * Track a view for a specific entity and update the UI
 * @param entityType The type of entity
 * @param entityId The ID of the entity
 */
export const trackEntityView = async (
  entityType: 'product' | 'business' | 'service' | 'post',
  entityId: string
): Promise<void> => {
  // Don't track views if the user is not logged in or if entityId is not valid
  if (!entityId) return;
  
  try {
    await incrementViewCount(entityType, entityId);
  } catch (error) {
    console.error(`Error tracking ${entityType} view:`, error);
  }
};
