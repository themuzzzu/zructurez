
export const getOptimalImageWidth = (containerWidth: number): number => {
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const width = Math.round(containerWidth * devicePixelRatio);
  
  if (width <= 640) return 640;
  if (width <= 768) return 768;
  if (width <= 1024) return 1024;
  if (width <= 1280) return 1280;
  return 1536;
};

export const optimizeImageUrl = (url: string, width: number): string => {
  if (!url) return '';
  if (url.includes('data:image')) return url;
  if (url.startsWith('blob:')) return url;
  
  // For Unsplash images
  if (url.includes('unsplash.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}w=${width}&q=75&auto=format`;
  }
  
  // For local/uploaded images, add width parameter
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}`;
};
