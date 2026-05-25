export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  status: number
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OrderItem {
  productId: string
  name: string
  brand: string
  emoji: string
  price: number
  size: string
  quantity: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  pinCode: string
  phone: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
}