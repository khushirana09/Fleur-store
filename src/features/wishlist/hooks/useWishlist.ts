import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../wishlistSlice'
import { MOCK_PRODUCTS } from '@/lib/api/mockData'
import type { Product } from '@/types/product.types'

export function useWishlist() {
  const dispatch    = useAppDispatch()
  const productIds  = useAppSelector((s) => s.wishlist.productIds)

  /* ── Actions ── */

  const toggle = useCallback(
    (id: string) => dispatch(toggleWishlist(id)),
    [dispatch]
  )

  const remove = useCallback(
    (id: string) => dispatch(removeFromWishlist(id)),
    [dispatch]
  )

  const clear = useCallback(
    () => dispatch(clearWishlist()),
    [dispatch]
  )

  /* ── Helpers ── */

  const isWished = useCallback(
    (id: string) => productIds.includes(id),
    [productIds]
  )

  /**
   * Resolve wishlist IDs → full Product objects.
   * In a real app, you'd fetch these from the server.
   */
  const wishlistProducts: Product[] = MOCK_PRODUCTS.filter((p) =>
    productIds.includes(p.id)
  )

  return {
    productIds,
    wishlistProducts,
    count: productIds.length,
    toggle,
    remove,
    clear,
    isWished,
  }
}