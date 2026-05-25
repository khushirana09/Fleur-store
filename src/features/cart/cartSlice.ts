import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, CartState } from '@/types/cart.types'
import { APP_CONFIG } from '@/lib/constants/config'

const STORAGE_KEY = 'fleur_cart'

/* ─── Persist helpers ──────────────────────────────────── */

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw
      ? (JSON.parse(raw) as CartState)
      : { items: [], promoCode: null, discount: 0 }
  } catch {
    return { items: [], promoCode: null, discount: 0 }
  }
}

function saveToStorage(state: CartState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

/* ─── Slice ────────────────────────────────────────────── */

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadFromStorage(),
  reducers: {
    /**
     * Add an item. If the same key (productId + size + color) already
     * exists, increment quantity up to MAX_CART_QUANTITY.
     */
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.key === action.payload.key)
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + action.payload.quantity,
          APP_CONFIG.maxCartQuantity
        )
      } else {
        state.items.push(action.payload)
      }
      saveToStorage(state as CartState)
    },

    /** Remove one item by its key */
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.key !== action.payload)
      saveToStorage(state as CartState)
    },

    /** Set quantity directly — used by +/- buttons */
    updateQuantity(
      state,
      action: PayloadAction<{ key: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.key === action.payload.key)
      if (item) {
        item.quantity = Math.max(
          1,
          Math.min(action.payload.quantity, APP_CONFIG.maxCartQuantity)
        )
      }
      saveToStorage(state as CartState)
    },

    /** Apply a validated promo code */
    applyPromo(
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) {
      state.promoCode = action.payload.code
      state.discount  = action.payload.discount
      saveToStorage(state as CartState)
    },

    /** Remove an applied promo code */
    removePromo(state) {
      state.promoCode = null
      state.discount  = 0
      saveToStorage(state as CartState)
    },

    /** Empty the cart — call after successful order placement */
    clearCart(state) {
      state.items     = []
      state.promoCode = null
      state.discount  = 0
      saveToStorage(state as CartState)
    },
  },
})

export const {
  addItem,
  removeItem,
  updateQuantity,
  applyPromo,
  removePromo,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer