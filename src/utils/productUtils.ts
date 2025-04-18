
/**
 * Format a number as an Indian currency price
 * @param price - The price to format
 * @returns Formatted price string (₹1,000)
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Format a number as an Indian currency price without the currency symbol
 * @param price - The price to format
 * @returns Formatted price string (1,000)
 */
export const formatPriceWithoutSymbol = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Calculate the discount percentage between original and sale price
 * @param originalPrice - The original price
 * @param salePrice - The discounted price
 * @returns Discount percentage as a whole number
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Truncate text to a specific length with ellipsis
 * @param text - The text to truncate
 * @param length - Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, length: number): string => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
