export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

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
  status: OrderStatus
  paymentMethod: string
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
}