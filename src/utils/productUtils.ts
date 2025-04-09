
/**
 * Formats a price value to display as currency
 */
export const formatPrice = (price: number | string | undefined, currency: string = '$'): string => {
  if (price === undefined || price === null) {
    return `${currency}0.00`;
  }
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Use Intl.NumberFormat for proper formatting
  return currency + numericPrice.toFixed(2);
};
