export interface CartItem {
  key: string
  productId: string
  name: string
  brand: string
  emoji: string
  price: number
  size: string
  color: string
  quantity: number
  slug: string
}

export interface CartState {
  items: CartItem[]
  promoCode: string | null
  discount: number
}

export interface CartSummary {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}