
/**
 * Formats a price value to display as Indian Rupees
 */
export const formatPrice = (price: number | string | undefined, currency: string = '₹'): string => {
  if (price === undefined || price === null) {
    return `${currency}0.00`;
  }
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format as Indian Rupees with thousands separator
  return currency + numericPrice.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

/**
 * Formats a price value to display as currency without the symbol
 */
export const formatPriceWithoutSymbol = (price: number | string | undefined): string => {
  if (price === undefined || price === null) {
    return '0';
  }
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return numericPrice.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};
