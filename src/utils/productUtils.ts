
/**
 * Formats a price value with currency symbol
 * @param price The price to format
 * @param currency The currency symbol to use, defaults to ₹
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = '₹'): string => {
  return `${currency}${price.toLocaleString('en-IN')}`;
};

/**
 * Calculate discount percentage
 * @param originalPrice Original price
 * @param discountedPrice Discounted price
 * @returns Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Check if a product is on sale
 * @param originalPrice Original price
 * @param currentPrice Current price
 * @returns Boolean indicating if product is on sale
 */
export const isOnSale = (originalPrice?: number, currentPrice?: number): boolean => {
  if (!originalPrice || !currentPrice) return false;
  return originalPrice > currentPrice;
};
