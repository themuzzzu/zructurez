
/**
 * Formats a price value as a currency string
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
 * Calculates the discount percentage based on original and current price
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  currentPrice: number
): number => {
  if (!originalPrice || originalPrice <= 0 || !currentPrice || currentPrice <= 0) {
    return 0;
  }
  
  const discount = originalPrice - currentPrice;
  const percentage = Math.round((discount / originalPrice) * 100);
  
  return percentage;
};

/**
 * Returns a truncated product description
 */
export const truncateDescription = (
  description: string,
  maxLength: number = 100
): string => {
  if (!description) return '';
  
  if (description.length <= maxLength) {
    return description;
  }
  
  return `${description.slice(0, maxLength)}...`;
};
