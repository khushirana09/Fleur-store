import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyPromo,
  removePromo,
} from '../cartSlice'
import type { Product } from '@/types/product.types'
import type { CartSummary } from '@/types/cart.types'
import { APP_CONFIG, PROMO_CODES } from '@/lib/constants/config'

export function useCart() {
  const dispatch = useAppDispatch()
  const { items, promoCode, discount } = useAppSelector((s) => s.cart)

  /* ── Actions ── */

  const addToCart = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      // Key is unique per product + size + color combination
      const key = `${product.id}-${size}-${color}`
      dispatch(
        addItem({
          key,
          productId: product.id,
          name:      product.name,
          brand:     product.brand,
          emoji:     product.emoji,
          price:     product.price,
          size,
          color,
          quantity,
          slug:      product.slug,
        })
      )
    },
    [dispatch]
  )

  const removeFromCart = useCallback(
    (key: string) => dispatch(removeItem(key)),
    [dispatch]
  )

  const updateQty = useCallback(
    (key: string, quantity: number) =>
      dispatch(updateQuantity({ key, quantity })),
    [dispatch]
  )

  const clear = useCallback(() => dispatch(clearCart()), [dispatch])

  /* ── Promo codes ── */

  const applyPromoCode = useCallback(
    (code: string): { success: boolean; message: string } => {
      const upperCode = code.trim().toUpperCase()
      const pct = PROMO_CODES[upperCode]
      if (pct) {
        dispatch(applyPromo({ code: upperCode, discount: pct }))
        return { success: true, message: `${pct}% discount applied!` }
      }
      return { success: false, message: 'Invalid or expired promo code' }
    },
    [dispatch]
  )

  const removePromoCode = useCallback(
    () => dispatch(removePromo()),
    [dispatch]
  )

  /* ── Computed summary ── */

  const summary: CartSummary = (() => {
    const subtotal     = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const discountAmt  = Math.round(subtotal * (discount / 100))
    const afterDiscount = subtotal - discountAmt
    const shipping     = afterDiscount >= APP_CONFIG.freeShippingThreshold
      ? 0
      : APP_CONFIG.shippingCost
    const tax          = Math.round(afterDiscount * APP_CONFIG.taxRate)
    const total        = afterDiscount + shipping + tax
    const itemCount    = items.reduce((sum, i) => sum + i.quantity, 0)

    return { subtotal, discount: discountAmt, shipping, tax, total, itemCount }
  })()

  /* ── Helpers ── */

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  )

  const getItemQuantity = useCallback(
    (productId: string) =>
      items
        .filter((i) => i.productId === productId)
        .reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  return {
    items,
    promoCode,
    discount,
    summary,
    addToCart,
    removeFromCart,
    updateQty,
    clear,
    applyPromoCode,
    removePromoCode,
    isInCart,
    getItemQuantity,
  }
}