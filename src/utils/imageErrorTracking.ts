
// Track and manage image loading errors

/**
 * Map to track failed image URLs
 * Key: Image URL
 * Value: Number of load attempts
 */
const failedImageAttempts = new Map<string, number>();

/**
 * Maximum number of retry attempts for an image
 */
const MAX_RETRY_ATTEMPTS = 2;

/**
 * Track an image loading error
 * @param imageUrl The URL of the image that failed to load
 * @returns Boolean indicating if more retries should be attempted
 */
export const trackImageError = (imageUrl: string): boolean => {
  if (!imageUrl) return false;
  
  const currentAttempts = failedImageAttempts.get(imageUrl) || 0;
  failedImageAttempts.set(imageUrl, currentAttempts + 1);
  
  // Return true if we should retry, false if we've exceeded max attempts
  return currentAttempts < MAX_RETRY_ATTEMPTS;
};

/**
 * Check if an image URL has exceeded retry attempts
 * @param imageUrl The URL of the image to check
 * @returns Boolean indicating if the image has exceeded retry attempts
 */
export const hasExceededRetryAttempts = (imageUrl: string): boolean => {
  if (!imageUrl) return true;
  const attempts = failedImageAttempts.get(imageUrl) || 0;
  return attempts >= MAX_RETRY_ATTEMPTS;
};

/**
 * Add a cache busting parameter to an image URL
 * @param imageUrl The original image URL
 * @param attempt The attempt number
 * @returns The image URL with a cache busting parameter
 */
export const getImageUrlWithCacheBusting = (imageUrl: string, attempt: number): string => {
  if (!imageUrl) return '';
  
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}_retry=${attempt}_${Date.now()}`;
};

/**
 * Reset tracking for an image URL
 * @param imageUrl The URL of the image to reset tracking for
 */
export const resetImageTracking = (imageUrl: string): void => {
  if (imageUrl) {
    failedImageAttempts.delete(imageUrl);
  }
};

/**
 * Reset all image tracking
 */
export const resetAllImageTracking = (): void => {
  failedImageAttempts.clear();
};
