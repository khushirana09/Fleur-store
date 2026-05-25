import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ProductFilters, SortOption } from '@/types/product.types'

interface ProductsUIState {
  activeCategory: string       // 'all' | any ProductCategory
  sort:           SortOption
  filters:        ProductFilters
  searchQuery:    string
  page:           number
  viewMode:       'grid' | 'list'
}

const initialFilters: ProductFilters = {
  categories:  [],
  priceMin:    0,
  priceMax:    10000,   /* Fleur price ceiling — affordable Indian fashion */
  sizes:       [],
  ratings:     [],
  inStockOnly: false,
}

const initialState: ProductsUIState = {
  activeCategory: 'all',
  sort:           'featured',
  filters:        initialFilters,
  searchQuery:    '',
  page:           1,
  viewMode:       'grid',
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload
      state.page = 1   // reset pagination on category change
    },

    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload
      state.page = 1
    },

    /** Merge partial filter update — only changed keys are updated */
    setFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 1
    },

    /** Reset all filters back to defaults */
    resetFilters(state) {
      state.filters        = initialFilters
      state.activeCategory = 'all'
      state.page           = 1
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
      state.page        = 1
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },

    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload
    },

    /** Clear search without resetting other filters */
    clearSearch(state) {
      state.searchQuery = ''
      state.page        = 1
    },
  },
})

export const {
  setActiveCategory,
  setSort,
  setFilters,
  resetFilters,
  setSearchQuery,
  setPage,
  setViewMode,
  clearSearch,
} = productsSlice.actions

export default productsSlice.reducer