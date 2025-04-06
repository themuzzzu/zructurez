
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
 * Default fallback images for different categories
 */
const DEFAULT_FALLBACKS = {
  product: "/placeholders/product-placeholder.jpg",
  service: "/placeholders/service-placeholder.jpg",
  business: "/placeholders/business-placeholder.jpg",
  general: "/placeholders/image-placeholder.jpg"
};

/**
 * Track an image loading error
 * @param imageUrl The URL of the image that failed to load
 * @returns Boolean indicating if more retries should be attempted
 */
export const trackImageError = (imageUrl: string): boolean => {
  if (!imageUrl) return false;
  
  const currentAttempts = failedImageAttempts.get(imageUrl) || 0;
  failedImageAttempts.set(imageUrl, currentAttempts + 1);
  
  console.log(`Image error tracked for ${imageUrl}, attempt ${currentAttempts + 1}`);
  
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
 * Get appropriate fallback image based on the type
 * @param type The type of content (product, service, business)
 * @returns URL to the appropriate fallback image
 */
export const getFallbackImage = (type: 'product' | 'service' | 'business' | 'general' = 'general'): string => {
  return DEFAULT_FALLBACKS[type] || DEFAULT_FALLBACKS.general;
};

/**
 * Check if a URL is likely a valid image URL
 * Common patterns that may suggest an invalid URL
 * @param url The URL to validate
 * @returns Boolean indicating if the URL appears valid
 */
export const isLikelyValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check for placeholder patterns that might not resolve
  if (url.includes('via.placeholder.com')) return false;
  if (url.includes('undefined')) return false;
  if (url.startsWith('data:image') && url.length < 100) return false;
  
  // Check for common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  // If the URL has parameters, it might still be valid without an explicit extension
  const hasParameters = url.includes('?');
  
  return hasImageExtension || hasParameters || url.includes('unsplash.com');
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
