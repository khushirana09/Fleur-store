// ─── Product ────────────────────────────────────────────────────────────────
export interface Product {
  id: number
  name: string
  brand: string
  slug: string
  price: number
  originalPrice?: number
  category: ProductCategory
  subCategory?: string
  emoji: string
  images: string[]
  badge?: 'new' | 'sale' | 'bestseller' | 'limited'
  rating: number
  reviewCount: number
  sizes: string[]
  colors: ProductColor[]
  description: string
  details: string[]
  materials: string[]
  isInStock: boolean
  stockCount: number
  tags: string[]
  createdAt: string
}

export type ProductCategory =
  | 'outerwear'
  | 'dresses'
  | 'footwear'
  | 'tops'
  | 'bottoms'
  | 'accessories'

export interface ProductColor {
  name: string
  hex: string
}

export interface ProductFilters {
  category?: ProductCategory | 'all'
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  brands?: string[]
  rating?: number
  inStock?: boolean
  badge?: Product['badge']
}

export type ProductSortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'bestselling'

export interface ProductsQueryParams extends ProductFilters {
  sort?: ProductSortOption
  page?: number
  limit?: number
  search?: string
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  key: string
  productId: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  emoji: string
  size: string
  color: string
  quantity: number
  imageUrl?: string
}

export interface Cart {
  items: CartItem[]
  promoCode?: string
  discount?: number
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface WishlistState {
  productIds: number[]
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  addresses: Address[]
  createdAt: string
}

export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  pinCode: string
  country: string
  isDefault: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: number
  name: string
  brand: string
  emoji: string
  size: string
  color: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: string
  placedAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingId?: string
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review'

export interface CheckoutState {
  step: CheckoutStep
  contactInfo: ContactInfo | null
  shippingAddress: Omit<Address, 'id' | 'isDefault'> | null
  shippingMethod: ShippingMethod | null
  paymentMethod: PaymentMethod | null
}

export interface ContactInfo {
  email: string
  phone: string
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export interface PaymentMethod {
  type: 'card' | 'upi' | 'netbanking' | 'cod'
  label: string
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

// ─── UI ───────────────────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string
  href?: string
}

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface SelectOption {
  value: string
  label: string
}

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ColorVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'