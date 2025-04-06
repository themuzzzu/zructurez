
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
