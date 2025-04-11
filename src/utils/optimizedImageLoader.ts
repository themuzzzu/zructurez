
/**
 * Optimized image loader utilities for better performance
 */

// Image format detection and optimization
export const getOptimalImageFormat = (): 'avif' | 'webp' | 'jpg' => {
  // Check for browser support
  if (typeof window === 'undefined') return 'jpg';
  
  // Check for AVIF support first (best compression)
  if (self.createImageBitmap && 'avif' in self.createImageBitmap) {
    return 'avif';
  }
  
  // Check for WebP support
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  // Fallback to JPEG
  return 'jpg';
};

// Calculate optimal image dimensions based on device
export const getOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number => {
  // Calculate the optimal size with a 20% buffer for quality
  const optimalWidth = Math.ceil(containerWidth * devicePixelRatio * 1.2);
  
  // Return the optimal width, but use standard breakpoints for better CDN caching
  if (optimalWidth <= 400) return 400;
  if (optimalWidth <= 800) return 800;
  if (optimalWidth <= 1200) return 1200;
  if (optimalWidth <= 1600) return 1600;
  return 2000; // Maximum size
};

// Priority calculation for images
export const calculateImagePriority = (
  elementTop: number, 
  viewportHeight: number
): 'high' | 'medium' | 'low' => {
  if (elementTop < viewportHeight) {
    // Element is in the initial viewport - high priority
    return 'high';
  } else if (elementTop < viewportHeight * 2) {
    // Element is just below the fold - medium priority
    return 'medium';
  }
  // Element is well below the fold - low priority
  return 'low';
};

// Generate optimized image URLs
export const getOptimizedImageUrl = (
  originalUrl: string, 
  width: number,
  format: 'avif' | 'webp' | 'jpg' = getOptimalImageFormat()
): string => {
  // For placeholder SVGs, return as is
  if (originalUrl.includes('placeholder.svg')) {
    return originalUrl;
  }
  
  // For remote URLs that don't support our optimization, return as is
  if (originalUrl.startsWith('http') && !originalUrl.includes('lovable-uploads')) {
    return originalUrl;
  }
  
  // For local images, add width parameter and convert format
  // This is a mock implementation - in a real app this would connect to an image optimization service
  // or use responsive images with srcset
  
  // Strip existing query parameters if any
  const baseUrl = originalUrl.split('?')[0];
  
  // Add optimization parameters
  return `${baseUrl}?w=${width}&fmt=${format}&q=80`;
};

// Preload critical images
export const preloadCriticalImages = (urls: string[]): void => {
  if (typeof window === 'undefined') return;
  
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};
