
const VALID_WIDTHS = [200, 400, 600, 800, 1200, 1600, 2000];

export const getOptimalImageWidth = (containerWidth: number): number => {
  const dpr = window.devicePixelRatio || 1;
  const idealWidth = containerWidth * dpr;
  
  return VALID_WIDTHS.find(w => w >= idealWidth) || VALID_WIDTHS[VALID_WIDTHS.length - 1];
};

export const optimizeImageUrl = (url: string, width: number): string => {
  if (!url || !url.startsWith('http')) return url;
  
  // Only optimize URLs from our domain
  if (!url.includes('lovable-uploads')) return url;
  
  const optimizedUrl = new URL(url);
  optimizedUrl.searchParams.set('w', width.toString());
  optimizedUrl.searchParams.set('q', '80'); // Decent quality
  optimizedUrl.searchParams.set('auto', 'format'); // Auto format detection
  
  return optimizedUrl.toString();
};

export const preloadCriticalImages = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};
