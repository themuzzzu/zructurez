
import { supabase } from "@/integrations/supabase/client";

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
    // Check if user has viewed this entity in the current session
    const sessionKey = `viewed_${entityType}_${entityId}`;
    const lastViewed = sessionStorage.getItem(sessionKey);
    
    if (lastViewed) {
      const lastViewedTime = parseInt(lastViewed, 10);
      const fifteenMinutesAgo = Date.now() - 900000; // 15 minutes in milliseconds
      
      if (lastViewedTime > fifteenMinutesAgo) {
        // User has viewed this entity within the last 15 minutes - don't increment
        console.log(`Skipping view increment for ${entityType} ${entityId} - viewed recently`);
        return;
      }
    }
    
    // Mark this entity as viewed in this session
    sessionStorage.setItem(sessionKey, Date.now().toString());
    
    console.log(`Incrementing view count for ${entityType} ${entityId}`);
    
    // Increment the view count based on entity type
    if (entityType === 'product') {
      const { error } = await supabase
        .from('products')
        .update({ views: (product) => (product.views || 0) + 1 })
        .eq('id', entityId);
      
      if (error) {
        console.error(`Error incrementing ${entityType} views:`, error);
      }
    } else if (entityType === 'business') {
      const { error } = await supabase
        .from('businesses')
        .update({ views: (business) => (business.views || 0) + 1 })
        .eq('id', entityId);
        
      if (error) {
        console.error(`Error incrementing ${entityType} views:`, error);
      }
    } else if (entityType === 'service') {
      const { error } = await supabase
        .from('services')
        .update({ views: (service) => (service.views || 0) + 1 })
        .eq('id', entityId);
        
      if (error) {
        console.error(`Error incrementing ${entityType} views:`, error);
      }
    } else if (entityType === 'post') {
      const { error } = await supabase
        .from('posts')
        .update({ views: (post) => (post.views || 0) + 1 })
        .eq('id', entityId);
        
      if (error) {
        console.error(`Error incrementing ${entityType} views:`, error);
      }
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
      
    // Handle services data with proper default values
    const serviceAnalytics = servicesError || !services 
      ? [] 
      : services.map(service => ({
          id: service.id,
          title: service.title,
          views: service.views || 0
        }));
    
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
      serviceAnalytics: serviceAnalytics,
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
  // Don't track views if the entity ID is not valid
  if (!entityId) return;
  
  try {
    await incrementViewCount(entityType, entityId);
  } catch (error) {
    console.error(`Error tracking ${entityType} view:`, error);
  }
};

/**
 * Format large numbers for display
 * @param num The number to format
 * @returns Formatted number as string (e.g. 1.2k, 3.4M)
 */
export const formatCountNumber = (num: number): string => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + 'k';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
};
