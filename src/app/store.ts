import { configureStore } from '@reduxjs/toolkit'
import authReducer     from '@/features/auth/authSlice'
import cartReducer     from '@/features/cart/cartSlice'
import wishlistReducer from '@/features/wishlist/wishlistSlice'
import productsReducer from '@/features/products/productsSlice'
import checkoutReducer from '@/features/checkout/checkoutSlice'

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    checkout: checkoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch