
/**
 * Optimized image loader utilities for better performance
 */

// Image format detection and optimization
export const getOptimalImageFormat = (): 'avif' | 'webp' | 'jpg' => {
  // Check for browser support
  if (typeof window === 'undefined') return 'jpg';
  
  // Try to detect AVIF support
  if (typeof HTMLImageElement !== 'undefined') {
    const img = document.createElement('img');
    if ('decode' in img && 'contentVisibility' in img.style) {
      // Modern browser with good image API support, probably supports AVIF
      return 'avif';
    }
  }
  
  // Check for WebP support
  try {
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
  } catch (e) {
    // Canvas or WebP not supported
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

// Image loading state management
export interface ImageLoadingState {
  loaded: boolean;
  error: boolean;
}

// Lazy load image batch handler
export const lazyLoadImages = (images: HTMLImageElement[], rootMargin: string = '200px') => {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback for older browsers
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    return;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            img.onerror = () => img.classList.add('error');
          }
          observer.unobserve(img);
        }
      });
    },
    { rootMargin }
  );
  
  images.forEach(img => observer.observe(img));
  
  return () => observer.disconnect();
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

// Progressive image loading quality
export const loadProgressiveImage = (
  lowQualitySrc: string, 
  highQualitySrc: string,
  imgElement: HTMLImageElement,
  onFullyLoaded?: () => void
) => {
  // First load low quality image
  imgElement.src = lowQualitySrc;
  imgElement.classList.add('blur-sm');
  
  // Then load high quality
  const highQualityImg = new Image();
  highQualityImg.src = highQualitySrc;
  highQualityImg.onload = () => {
    imgElement.src = highQualitySrc;
    imgElement.classList.remove('blur-sm');
    if (onFullyLoaded) onFullyLoaded();
  };
};
