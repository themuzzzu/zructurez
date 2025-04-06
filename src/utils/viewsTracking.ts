
/**
 * Track entity views (products, businesses, services)
 */
export const trackEntityView = async (entityType: 'product' | 'business' | 'service', entityId: string) => {
  if (!entityId) {
    return;
  }

  try {
    // Only track in production environment
    if (process.env.NODE_ENV === 'production') {
      // Create a background task instead of blocking the UI
      setTimeout(async () => {
        await incrementViewCount(entityType, entityId);
      }, 1000);
    }
    
    // Store in local tracking cache to prevent duplicate views
    const viewKey = `${entityType}_${entityId}_viewed`;
    const lastViewed = localStorage.getItem(viewKey);
    const now = Date.now();
    
    // Only record a new view if more than 30 minutes have passed since last view
    if (!lastViewed || (now - parseInt(lastViewed)) > 30 * 60 * 1000) {
      localStorage.setItem(viewKey, now.toString());
    }
  } catch (error) {
    console.error(`Error tracking ${entityType} view:`, error);
  }
};

/**
 * Increment view count for an entity
 */
export const incrementViewCount = async (entityType: 'product' | 'business' | 'service' | 'ad', entityId: string) => {
  try {
    // Call your API to increment the view count
    // This is intentionally not implemented as it would require backend changes
    console.log(`Incrementing view count for ${entityType} ${entityId}`);
  } catch (error) {
    console.error(`Error incrementing view count for ${entityType}:`, error);
  }
};

/**
 * Format large numbers for display
 * For example: 1000 -> 1K, 1000000 -> 1M
 */
export const formatCountNumber = (num: number): string => {
  if (num === undefined || num === null) return '0';
  
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
};

/**
 * Fetch analytics data for a business
 * @param userId The user ID who owns the business
 * @returns Business analytics data
 */
export const fetchBusinessAnalytics = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }
  
  try {
    // This would typically be an API call to get real analytics data
    // For now, we'll return mock data
    return {
      businessViews: 1245,
      productAnalytics: [
        { id: "prod-1", title: "Product 1", views: 523 },
        { id: "prod-2", title: "Product 2", views: 342 },
        { id: "prod-3", title: "Product 3", views: 211 }
      ],
      serviceAnalytics: [
        { id: "serv-1", title: "Service 1", views: 412 },
        { id: "serv-2", title: "Service 2", views: 189 }
      ],
      postAnalytics: [
        { id: "post-1", content: "First post", views: 87 },
        { id: "post-2", content: "Second post", views: 62 }
      ],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching business analytics:", error);
    return null;
  }
};
