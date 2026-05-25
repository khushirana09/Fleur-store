import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { FilterPanel } from '@/components/shared/FilterPanel'
import { ProductCard } from '@/components/shared/ProductCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
    setActiveCategory, setSort, setSearchQuery,
    setPage, setViewMode, resetFilters,
} from '@/features/products/productsSlice'
import { useProducts } from '@/features/products/hooks/useProducts'
import { CATEGORY_LABELS } from '@/lib/constants/config'
import type { SortOption } from '@/types/product.types'
import { cn } from '@/lib/utils/cn'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'popular', label: 'Most Popular' },
]

export function Shop() {
    const dispatch = useAppDispatch()
    const [searchParams] = useSearchParams()
    const [filterOpen, setFilterOpen] = useState(false)

    const { activeCategory, sort, filters, searchQuery, page, viewMode } =
        useAppSelector((s) => s.products)

    useEffect(() => {
        const cat = searchParams.get('category')
        const sortP = searchParams.get('sort') as SortOption | null
        const search = searchParams.get('q')
        if (cat) dispatch(setActiveCategory(cat))
        if (sortP) dispatch(setSort(sortP))
        if (search) dispatch(setSearchQuery(search))
    }, []) // eslint-disable-line

    const { data, isLoading, isFetching } = useProducts({
        page,
        limit: 12,
        category: activeCategory !== 'all' ? (activeCategory as any) : undefined,
        sort,
        search: searchQuery || undefined,
        filters,
    })

    const products = data?.products ?? []
    const total = data?.total ?? 0
    const totalPages = data?.totalPages ?? 1

    const catLabel = activeCategory !== 'all'
        ? CATEGORY_LABELS[activeCategory] ?? activeCategory
        : 'All Products'

    return (
        <PageWrapper title={catLabel}>
            {/* Breadcrumb */}
            <div className="border-b border-rose-100">
                <div className="container-app py-3">
                    <Breadcrumb
                        items={[
                            { label: 'Shop', href: '/shop' },
                            ...(activeCategory !== 'all' ? [{ label: catLabel }] : []),
                        ]}
                    />
                </div>
            </div>

            <div className="container-app py-6 sm:py-8">

                {/* ── Page title + controls — stack on mobile ── */}
                <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h1 className="font-serif font-normal text-mauve-900"
                                style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                                {searchQuery
                                    ? <>Results for{' '}
                                        <em className="not-italic text-rose-500">"{searchQuery}"</em>
                                    </>
                                    : catLabel}
                            </h1>
                            {!isLoading && (
                                <p className="text-mauve-400 text-sm mt-1">
                                    {total} {total === 1 ? 'product' : 'products'}
                                </p>
                            )}
                        </div>

                        {/* Filter toggle — mobile */}
                        <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<SlidersHorizontal size={14} />}
                            onClick={() => setFilterOpen(true)}
                            className="lg:hidden shrink-0"
                        >
                            Filter
                        </Button>
                    </div>

                    {/* Sort row — scrollable on mobile */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Active search badge */}
                        {searchQuery && (
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm text-mauve-400 shrink-0">Search:</span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border
                                 border-rose-100 rounded-full text-sm text-mauve-700
                                 truncate max-w-40">
                                    {searchQuery}
                                    <button
                                        onClick={() => dispatch(setSearchQuery(''))}
                                        className="text-mauve-400 hover:text-mauve-700 shrink-0"
                                        aria-label="Clear search"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                            {/* Sort select */}
                            <select
                                value={sort}
                                onChange={(e) => dispatch(setSort(e.target.value as SortOption))}
                                className="input-base py-2 text-sm w-auto
                           min-w-35 sm:min-w-45"
                                aria-label="Sort products"
                                style={{ fontSize: '14px' }}
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>

                            {/* View mode — desktop only */}
                            <div className="hidden sm:flex border border-rose-100 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => dispatch(setViewMode('grid'))}
                                    aria-label="Grid view"
                                    className={cn(
                                        'p-2.5 transition-colors',
                                        viewMode === 'grid'
                                            ? 'bg-rose-50 text-rose-500'
                                            : 'text-mauve-400 hover:text-mauve-700'
                                    )}
                                >
                                    <LayoutGrid size={15} />
                                </button>
                                <button
                                    onClick={() => dispatch(setViewMode('list'))}
                                    aria-label="List view"
                                    className={cn(
                                        'p-2.5 transition-colors border-l border-rose-100',
                                        viewMode === 'list'
                                            ? 'bg-rose-50 text-rose-500'
                                            : 'text-mauve-400 hover:text-mauve-700'
                                    )}
                                >
                                    <List size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main layout */}
                <div className="flex gap-6 lg:gap-8">

                    {/* Desktop sidebar */}
                    <aside className="hidden lg:block w-52 xl:w-60 shrink-0">
                        <FilterPanel />
                    </aside>

                    {/* Mobile filter drawer */}
                    <AnimatePresence>
                        {filterOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-40 bg-mauve-900/40 backdrop-blur-sm lg:hidden"
                                    onClick={() => setFilterOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                                    className="fixed left-0 top-0 bottom-0 z-50 bg-white
                             border-r border-rose-100 overflow-y-auto p-5 lg:hidden
                             w-[85vw] max-w-75"
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <h2 className="font-serif text-xl font-normal text-mauve-900">
                                            Filters
                                        </h2>
                                        <button
                                            onClick={() => setFilterOpen(false)}
                                            className="w-9 h-9 flex items-center justify-center rounded-full
                                 border border-rose-100 text-mauve-400 hover:text-mauve-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <FilterPanel />
                                    <div className="mt-6 pt-4 border-t border-rose-100">
                                        <Button fullWidth onClick={() => setFilterOpen(false)}>
                                            Show {total} Results
                                        </Button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Product grid */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <ProductGridSkeleton count={12} />
                        ) : products.length === 0 ? (
                            <EmptyState
                                icon="🌸"
                                title="No products found"
                                description="Try adjusting your filters or search query."
                                action={{
                                    label: 'Clear Filters',
                                    onClick: () => dispatch(resetFilters()),
                                }}
                            />
                        ) : (
                            <motion.div
                                key={`${activeCategory}-${sort}-${page}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isFetching ? 0.6 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {viewMode === 'grid' ? (
                                    /* Responsive grid: 2 cols mobile, 2 tablet, 3 desktop */
                                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3
                                  gap-3 sm:gap-4 lg:gap-5">
                                        {products.map((p, i) => (
                                            <ProductCard key={p.id} product={p} index={i} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {products.map((p, i) => (
                                            <ProductCard key={p.id} product={p} index={i} listView />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Pagination — scrollable on mobile */}
                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-1 overflow-x-auto
                              pb-2 scrollbar-hide">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => dispatch(setPage(page - 1))}
                                    className="shrink-0"
                                >
                                    ← Prev
                                </Button>
                                <div className="flex items-center gap-1 shrink-0">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => dispatch(setPage(p))}
                                            className={cn(
                                                'w-9 h-9 rounded-xl text-sm transition-colors shrink-0',
                                                p === page
                                                    ? 'bg-rose-500 text-white font-medium'
                                                    : 'text-mauve-500 hover:text-mauve-800 hover:bg-rose-50'
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => dispatch(setPage(page + 1))}
                                    className="shrink-0"
                                >
                                    Next →
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}