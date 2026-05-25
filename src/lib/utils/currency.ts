import currency from 'currency.js'

/**
 * Format a number as Indian Rupees.
 * formatPrice(129000) → "₹1,29,000"
 */
export function formatPrice(
  amount: number,
  opts?: { showDecimal?: boolean }
): string {
  const { showDecimal = false } = opts ?? {}
  return currency(amount, {
    symbol: '₹',
    separator: ',',
    decimal: '.',
    precision: showDecimal ? 2 : 0,
    pattern: '!#',
  }).format()
}

/**
 * Calculate discount percentage between price and compare price.
 * calculateDiscount(129000, 189000) → 32
 */
export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/**
 * Calculate GST (18%) on an amount.
 */
export function calculateTax(amount: number, rate = 0.18): number {
  return Math.round(amount * rate)
}