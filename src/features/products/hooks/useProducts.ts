import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { productsApi } from '../productsApi'
import type { ProductsQueryParams } from '@/types/product.types'

/* ─── Query key factory ─────────────────────────────────
   Centralised keys mean invalidations work predictably.
   e.g. queryClient.invalidateQueries({ queryKey: productKeys.all })
────────────────────────────────────────────────────────── */
export const productKeys = {
  all:      ['products'] as const,
  lists:    () => [...productKeys.all, 'list'] as const,
  list:     (params: ProductsQueryParams) =>
              [...productKeys.lists(), params] as const,
  detail:   (slug: string) =>
              [...productKeys.all, 'detail', slug] as const,
  related:  (id: string) =>
              [...productKeys.all, 'related', id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  newArr:   () => [...productKeys.all, 'new-arrivals'] as const,
}

/* ─── Hooks ─────────────────────────────────────────────── */

/**
 * Paginated, filtered, sorted product list.
 * `placeholderData: keepPreviousData` prevents the list from
 * flickering to a loader every time filters change.
 */
export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey:        productKeys.list(params),
    queryFn:         () => productsApi.getAll(params),
    staleTime:       5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Single product detail by slug.
 * Only fires when slug is truthy.
 */
export function useProduct(slug: string) {
  return useQuery({
    queryKey:  productKeys.detail(slug),
    queryFn:   () => productsApi.getBySlug(slug),
    staleTime: 10 * 60 * 1000,
    enabled:   !!slug,
  })
}

/**
 * Related products for the "You may also like" section.
 */
export function useRelatedProducts(id: string) {
  return useQuery({
    queryKey:  productKeys.related(id),
    queryFn:   () => productsApi.getRelated(id),
    staleTime: 10 * 60 * 1000,
    enabled:   !!id,
  })
}

/**
 * Featured products for the home page hero section.
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey:  productKeys.featured(),
    queryFn:   () => productsApi.getFeatured(),
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Latest arrivals for the home page.
 */
export function useNewArrivals() {
  return useQuery({
    queryKey:  productKeys.newArr(),
    queryFn:   () => productsApi.getNewArrivals(),
    staleTime: 10 * 60 * 1000,
  })
}