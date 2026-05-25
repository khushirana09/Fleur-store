import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface WishlistState {
  productIds: string[]
}

const STORAGE_KEY = 'fleur_wishlist'

function load(): WishlistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as WishlistState) : { productIds: [] }
  } catch {
    return { productIds: [] }
  }
}

function save(state: WishlistState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: load(),
  reducers: {
    /**
     * Toggle a product in/out of the wishlist.
     * If it's there → remove it. If not → add it.
     */
    toggleWishlist(state, action: PayloadAction<string>) {
      const idx = state.productIds.indexOf(action.payload)
      if (idx >= 0) {
        state.productIds.splice(idx, 1)
      } else {
        state.productIds.push(action.payload)
      }
      save(state as WishlistState)
    },

    /** Remove a specific product */
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload)
      save(state as WishlistState)
    },

    /** Empty the entire wishlist */
    clearWishlist(state) {
      state.productIds = []
      save(state as WishlistState)
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions
export default wishlistSlice.reducer