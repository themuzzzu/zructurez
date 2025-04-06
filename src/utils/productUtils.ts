
/**
 * Format price with currency symbol
 */
export const formatPrice = (price?: number | string): string => {
  if (price === undefined || price === null) {
    return "₹0";
  }
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return "₹0";
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice);
};

/**
 * Calculate discount percentage between original and sale price
 */
export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Determine if a product has a valid discount
 */
export const hasValidDiscount = (product: any): boolean => {
  if (!product) return false;
  
  // Check if product has explicit discount flag
  if (product.is_discounted) return true;
  
  // Check if product has both original and current price
  if (product.original_price && product.price && product.original_price > product.price) {
    return true;
  }
  
  // Check if product has discount percentage
  if (product.discount_percentage && product.discount_percentage > 0) {
    return true;
  }
  
  return false;
};

/**
 * Formats a number as Indian rupees with commas in the appropriate places for thousands, lakhs, crores
 */
export const formatIndianCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

/**
 * Convert price to smaller units for display based on value
 * e.g. 10000 -> ₹10K, 1000000 -> ₹10L, 10000000 -> ₹1Cr
 */
export const formatCompactPrice = (price?: number): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "₹0";
  }
  
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  
  return formatPrice(price);
};
