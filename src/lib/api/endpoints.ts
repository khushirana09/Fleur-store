export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT:   '/auth/logout',
    REFRESH:  '/auth/refresh',
    ME:       '/auth/me',
  },
  PRODUCTS: {
    LIST:    '/products',
    DETAIL:  (slug: string) => `/products/${slug}`,
    RELATED: (id: string)   => `/products/${id}/related`,
  },
  ORDERS: {
    LIST:   '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  USER: {
    PROFILE:   '/user/profile',
    UPDATE:    '/user/profile',
    WISHLIST:  '/user/wishlist',
    ADDRESSES: '/user/addresses',
  },
  PROMO: {
    VALIDATE: '/promo/validate',
  },
} as const