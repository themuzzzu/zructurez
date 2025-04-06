
// Add utility for tracking views and formatting count numbers

export const incrementViewCount = async (entityType: 'product' | 'business' | 'service' | 'post', entityId: string) => {
  try {
    // This is a stub function - in a real app this would call an API
    console.log(`Tracking view for ${entityType} with ID ${entityId}`);
    return true;
  } catch (error) {
    console.error(`Error tracking view for ${entityType}:`, error);
    return false;
  }
};

export const trackEntityView = async (entityType: 'product' | 'business' | 'service' | 'post', entityId: string) => {
  try {
    // This is a stub function - in a real app this would call an API
    console.log(`Tracking entity view for ${entityType} with ID ${entityId}`);
    return await incrementViewCount(entityType, entityId);
  } catch (error) {
    console.error(`Error tracking entity view for ${entityType}:`, error);
    return false;
  }
};

export const formatCountNumber = (count?: number): string => {
  if (count === undefined || count === null) {
    return '0';
  }
  
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + 'k';
  } else {
    return (count / 1000000).toFixed(1) + 'm';
  }
};

// Add the missing fetchBusinessAnalytics function
export const fetchBusinessAnalytics = async (userId?: string) => {
  if (!userId) {
    return null;
  }
  
  try {
    console.log(`Fetching business analytics for user ${userId}`);
    
    // This is a stub function that returns mock data
    // In a real app, this would make an API call to get actual analytics data
    return {
      businessViews: 1240,
      productAnalytics: [
        {
          id: 'product-1',
          title: 'Product 1',
          views: 346
        },
        {
          id: 'product-2',
          title: 'Product 2',
          views: 289
        },
        {
          id: 'product-3',
          title: 'Product 3',
          views: 215
        }
      ],
      serviceAnalytics: [
        {
          id: 'service-1',
          title: 'Service 1',
          views: 178
        },
        {
          id: 'service-2',
          title: 'Service 2',
          views: 132
        }
      ],
      postAnalytics: [
        {
          id: 'post-1',
          content: 'First post',
          views: 80
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching business analytics:', error);
    return null;
  }
};
