export const APP_CONFIG = {
  name:                  import.meta.env.VITE_APP_NAME ?? 'Fleur',
  tagline:               'Wear Your Story',
  description:           "India's favourite women's fashion destination — kurtas, dresses, sarees & more.",
  apiUrl:                import.meta.env.VITE_API_URL  ?? 'http://localhost:3001/api',
  currency:              'INR',
  currencySymbol:        '₹',
  taxRate:               0.18,
  freeShippingThreshold: 999,
  shippingCost:          79,
  itemsPerPage:          12,
  maxCartQuantity:       10,
  instagram:             'https://instagram.com/fleur.india',
  whatsapp:              'https://wa.me/919876543210',
} as const

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Chandigarh', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
] as const

export const CATEGORY_LABELS: Record<string, string> = {
  kurtas:      'Kurtas & Suits',
  dresses:     'Dresses',
  sarees:      'Sarees & Lehengas',
  tops:        'Tops & Co-ords',
  bottoms:     'Bottoms',
  accessories: 'Jewellery & Accessories',
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  kurtas:      '👘',
  dresses:     '👗',
  sarees:      '🥻',
  tops:        '👚',
  bottoms:     '👖',
  accessories: '💍',
}

export const PROMO_CODES: Record<string, number> = {
  FLEUR10: 10,   // 10% off
  SAVE20: 20,    // 20% off
  WELCOME: 15,   // 15% off
}