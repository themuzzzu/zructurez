
/**
 * Format a price value to a currency string
 * @param price The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Calculate discount percentage
 * @param originalPrice Original price
 * @param discountedPrice Discounted price
 * @returns Discount percentage as a whole number
 */
export const calculateDiscountPercentage = (
  originalPrice: number, 
  discountedPrice: number
): number => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) {
    return 0;
  }
  
  const discount = originalPrice - discountedPrice;
  const percentage = (discount / originalPrice) * 100;
  
  return Math.round(percentage);
};

/**
 * Check if a product is new (created within the last 7 days)
 * @param createdAt Product creation date string
 * @returns Boolean indicating if product is new
 */
export const isNewProduct = (createdAt: string): boolean => {
  const productDate = new Date(createdAt);
  const now = new Date();
  const differenceInDays = (now.getTime() - productDate.getTime()) / (1000 * 3600 * 24);
  
  return differenceInDays <= 7;
};
