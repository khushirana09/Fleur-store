export type ProductCategory =
  | 'kurtas'
  | 'dresses'
  | 'sarees'
  | 'co_ords'
  | 'tops'
  | 'bottoms'
  | 'accessories'

export type ProductBadge = 'new' | 'sale' | 'bestseller'

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  name: string
  brand: string
  slug: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  emoji: string
  badge?: ProductBadge
  rating: number
  reviewCount: number
  sizes: string[]
  colors: ProductColor[]
  description: string
  details: string[]
  images: string[]
  inStock: boolean
  stockCount: number
  tags: string[]
  createdAt: string
}

export interface ProductFilters {
  categories: ProductCategory[]
  priceMin: number
  priceMax: number
  sizes: string[]
  ratings: number[]
  inStockOnly: boolean
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popular'

export interface ProductsQueryParams {
  page?: number
  limit?: number
  category?: ProductCategory
  sort?: SortOption
  search?: string
  filters?: Partial<ProductFilters>
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}