import { useState } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters, resetFilters } from '@/features/products/productsSlice'
import { formatPrice } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'
import type { ProductCategory } from '@/types/product.types'

/* ─── Fleur Indian fashion categories ───────────────────── */
const CATEGORIES: { value: ProductCategory; label: string; emoji: string }[] = [
    { value: 'kurtas', label: 'Kurtas & Suits', emoji: '👘' },
    { value: 'dresses', label: 'Dresses', emoji: '👗' },
    { value: 'sarees', label: 'Sarees & Lehengas', emoji: '🥻' },
    { value: 'tops', label: 'Tops & Co-ords', emoji: '👚' },
    { value: 'bottoms', label: 'Bottoms', emoji: '👖' },
    { value: 'accessories', label: 'Jewellery & Accessories', emoji: '💍' },
]

/* ─── Price range for Indian fashion (₹0 – ₹15,000) ─────── */
const PRICE_MAX = 15000
const RATINGS = [5, 4, 3, 2]

/* ─── Collapsible section ────────────────────────────────── */
function FilterSection({
    title,
    defaultOpen = true,
    children,
}: {
    title: string
    defaultOpen?: boolean
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="border-b border-rose-100 py-4 last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-left"
                aria-expanded={open}
            >
                <span className="text-[11px] tracking-[0.1em] uppercase text-mauve-600 font-medium">
                    {title}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        'text-mauve-400 transition-transform duration-200',
                        open && 'rotate-180'
                    )}
                    aria-hidden="true"
                />
            </button>

            <div
                className={cn(
                    'overflow-hidden transition-all duration-300',
                    open ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                {children}
            </div>
        </div>
    )
}

/* ─── Main FilterPanel ───────────────────────────────────── */
export function FilterPanel() {
    const dispatch = useAppDispatch()
    const { filters } = useAppSelector((s) => s.products)

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.sizes.length > 0 ||
        filters.priceMax < PRICE_MAX ||
        filters.inStockOnly ||
        filters.ratings.length > 0

    function toggleCategory(val: ProductCategory) {
        const updated = filters.categories.includes(val)
            ? filters.categories.filter((c) => c !== val)
            : [...filters.categories, val]
        dispatch(setFilters({ categories: updated }))
    }

    function toggleRating(r: number) {
        const updated = filters.ratings.includes(r)
            ? filters.ratings.filter((x) => x !== r)
            : [...filters.ratings, r]
        dispatch(setFilters({ ratings: updated }))
    }

    return (
        <aside aria-label="Product filters">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 pb-4 border-b border-rose-100">
                <h2 className="text-sm font-medium text-mauve-800">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={() => dispatch(resetFilters())}
                        className="flex items-center gap-1 text-[11px] text-rose-500
                       hover:text-rose-700 transition-colors"
                    >
                        <RotateCcw size={11} />
                        Clear all
                    </button>
                )}
            </div>

            {/* Category */}
            <FilterSection title="Category">
                <div className="space-y-2">
                    {CATEGORIES.map(({ value, label, emoji }) => (
                        <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(value)}
                                onChange={() => toggleCategory(value)}
                                className="w-3.5 h-3.5 accent-rose-400 rounded"
                            />
                            <span className="text-sm text-mauve-500 group-hover:text-mauve-800
                               transition-colors flex items-center gap-1.5">
                                <span aria-hidden="true">{emoji}</span>
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
                <div className="space-y-3 px-1">
                    <input
                        type="range"
                        min={0}
                        max={PRICE_MAX}
                        step={100}
                        value={Math.min(filters.priceMax, PRICE_MAX)}
                        onChange={(e) =>
                            dispatch(setFilters({ priceMax: Number(e.target.value) }))
                        }
                        className="w-full accent-rose-400 cursor-pointer"
                        aria-label="Maximum price"
                    />
                    <div className="flex justify-between text-[11px]">
                        <span className="text-mauve-400">₹0</span>
                        <span className="text-rose-500 font-medium">
                            {formatPrice(Math.min(filters.priceMax, PRICE_MAX))}
                        </span>
                    </div>
                </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Minimum Rating">
                <div className="space-y-2">
                    {RATINGS.map((r) => (
                        <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.ratings.includes(r)}
                                onChange={() => toggleRating(r)}
                                className="w-3.5 h-3.5 accent-rose-400"
                            />
                            <span className="text-sm text-mauve-500 group-hover:text-mauve-800
                               transition-colors flex items-center gap-1">
                                <span className="text-rose-400 text-[13px]">
                                    {'★'.repeat(r)}
                                    <span className="text-rose-200">{'★'.repeat(5 - r)}</span>
                                </span>
                                <span className="text-mauve-400 text-[11px]">& up</span>
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability" defaultOpen={false}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={(e) =>
                            dispatch(setFilters({ inStockOnly: e.target.checked }))
                        }
                        className="w-3.5 h-3.5 accent-rose-400"
                    />
                    <span className="text-sm text-mauve-500 group-hover:text-mauve-800 transition-colors">
                        In stock only
                    </span>
                </label>
            </FilterSection>
        </aside>
    )
}