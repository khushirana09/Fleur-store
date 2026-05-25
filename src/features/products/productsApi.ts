import { MOCK_PRODUCTS } from '@/lib/api/mockData'
import type {
  Product,
  ProductsQueryParams,
  ProductsResponse,
  SortOption,
} from '@/types/product.types'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products]
  switch (sort) {
    case 'price-asc':  return list.sort((a, b) => a.price - b.price)
    case 'price-desc': return list.sort((a, b) => b.price - a.price)
    case 'rating':     return list.sort((a, b) => b.rating - a.rating)
    case 'popular':    return list.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'newest':
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'featured':
    default:
      // Bestsellers and new-badge items first
      return list.sort((a, b) => {
        const weight = (p: Product) =>
          p.badge === 'bestseller' ? 2 : p.badge === 'new' ? 1 : 0
        return weight(b) - weight(a)
      })
  }
}

export const productsApi = {
  /**
   * Fetch a paginated, filtered, sorted list of products.
   * Replace this body with: return apiClient.get('/products', { params })
   */
  async getAll(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    await delay(600)

    const {
      page    = 1,
      limit   = 12,
      category,
      sort    = 'featured',
      search,
      filters,
    } = params

    let products = [...MOCK_PRODUCTS]

    // ── Category filter ──
    if (category) {
      products = products.filter((p) => p.category === category)
    }

    // ── Search filter ──
    if (search) {
      const q = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.category.includes(q)
      )
    }

    // ── Advanced filters ──
    if (filters) {
      if (filters.categories?.length)
        products = products.filter((p) =>
          filters.categories!.includes(p.category)
        )
      if (typeof filters.priceMin === 'number')
        products = products.filter((p) => p.price >= filters.priceMin!)
      if (typeof filters.priceMax === 'number')
        products = products.filter((p) => p.price <= filters.priceMax!)
      if (filters.sizes?.length)
        products = products.filter((p) =>
          filters.sizes!.some((s) => p.sizes.includes(s))
        )
      if (filters.ratings?.length)
        products = products.filter((p) =>
          filters.ratings!.some((r) => p.rating >= r)
        )
      if (filters.inStockOnly)
        products = products.filter((p) => p.inStock)
    }

    // ── Sort ──
    products = sortProducts(products, sort)

    // ── Paginate ──
    const total      = products.length
    const totalPages = Math.ceil(total / limit)
    const start      = (page - 1) * limit
    const paginated  = products.slice(start, start + limit)

    return { products: paginated, total, page, limit, totalPages }
  },

  /** Fetch one product by its URL slug */
  async getBySlug(slug: string): Promise<Product> {
    await delay(400)
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
    if (!product) throw new Error(`Product not found: ${slug}`)
    return product
  },

  /** Fetch products in the same category (for "You may also like") */
  async getRelated(id: string, limit = 4): Promise<Product[]> {
    await delay(300)
    const product = MOCK_PRODUCTS.find((p) => p.id === id)
    if (!product) return []
    return MOCK_PRODUCTS
      .filter((p) => p.id !== id && p.category === product.category)
      .slice(0, limit)
  },

  /** Fetch hero/featured products for the home page */
  async getFeatured(limit = 4): Promise<Product[]> {
    await delay(300)
    return MOCK_PRODUCTS
      .filter((p) => p.badge === 'bestseller' || p.badge === 'new')
      .slice(0, limit)
  },

  /** Fetch newest arrivals */
  async getNewArrivals(limit = 4): Promise<Product[]> {
    await delay(300)
    return [...MOCK_PRODUCTS]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
  },
}