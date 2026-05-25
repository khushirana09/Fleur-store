export const ROUTES = {
  HOME:              '/',
  SHOP:              '/shop',
  PRODUCT:           '/products/:slug',
  WISHLIST:          '/wishlist',
  CHECKOUT:          '/checkout',
  CHECKOUT_SUCCESS:  '/checkout/success',
  PROFILE:           '/profile',
  PROFILE_ORDERS:    '/profile/orders',
  PROFILE_WISHLIST:  '/profile/wishlist',
  PROFILE_SETTINGS:  '/profile/settings',
  LOGIN:             '/auth/login',
  REGISTER:          '/auth/register',
  NOT_FOUND:         '*',
} as const

/** Build a product detail URL from a slug */
export function productPath(slug: string): string {
  return `/products/${slug}`
}