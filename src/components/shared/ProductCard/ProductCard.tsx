import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/shared/StarRating'
import { useCart } from '@/features/cart/hooks/useCart'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { formatPrice, calculateDiscount } from '@/lib/utils/currency'
import { productPath } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/types/product.types'
import toast from 'react-hot-toast'

export interface ProductCardProps {
    product: Product
    index?: number
    className?: string
    /** Show in compact list view */
    listView?: boolean
}

export function ProductCard({
    product,
    index = 0,
    className,
    listView = false,
}: ProductCardProps) {
    const { addToCart, isInCart } = useCart()
    const { toggle, isWished } = useWishlist()

    const wished = isWished(product.id)
    const inCart = isInCart(product.id)
    const discount = product.compareAtPrice
        ? calculateDiscount(product.price, product.compareAtPrice)
        : 0

    function handleQuickAdd(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        addToCart(
            product,
            product.sizes[0],
            product.colors[0]?.name ?? 'Default'
        )
        toast.success(`Added to bag`, {
            icon: '✦',
            duration: 2000,
            id: `cart-${product.id}`,   // prevent duplicate toasts
        })
    }

    function handleWishToggle(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        toggle(product.id)
        toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', {
            icon: wished ? '♡' : '♥',
            duration: 2000,
            id: `wish-${product.id}`,
        })
    }

    /* ── List view layout ─────────────────────────────── */
    if (listView) {
        return (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className={cn(
                    'flex gap-4 bg-cream-100 border border-rose-100 rounded-lg p-4',
                    'hover:border-rose-200 transition-colors group',
                    className
                )}
            >
                <Link
                    to={productPath(product.slug)}
                    className="flex-shrink-0 w-24 h-28 bg-cream-200 rounded flex items-center
                     justify-center text-5xl overflow-hidden"
                >
                    {product.emoji}
                </Link>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-mauve-500">
                        {product.brand}
                    </p>
                    <Link to={productPath(product.slug)}>
                        <h3 className="text-sm text-mauve-700 font-medium mt-0.5 hover:text-rose-400 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <StarRating rating={product.rating} reviewCount={product.reviewCount} size="xs" className="mt-1" />
                    <div className="flex items-center gap-8 mt-2">
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-base text-rose-400">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <span className="text-xs text-mauve-400 line-through">
                                    {formatPrice(product.compareAtPrice)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleQuickAdd}
                            className="text-[11px] tracking-wider uppercase text-mauve-500
                         hover:text-rose-400 transition-colors flex items-center gap-1"
                        >
                            <ShoppingBag size={13} />
                            {inCart ? 'Add More' : 'Quick Add'}
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleWishToggle}
                    aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="flex-shrink-0 self-start"
                >
                    <Heart
                        size={16}
                        className={cn(
                            'transition-colors',
                            wished
                                ? 'fill-rose-400 text-rose-400'
                                : 'text-mauve-300 hover:text-rose-400'
                        )}
                    />
                </button>
            </motion.div>
        )
    }

    /* ── Grid view layout (default) ───────────────────── */
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn('group', className)}
        >
            <Link to={productPath(product.slug)} className="block">
                {/* ── Image container ── */}
                <div
                    className="relative aspect-[3/4] bg-cream-100 rounded-lg overflow-hidden
                     border border-rose-100 group-hover:border-rose-200
                     transition-colors duration-300"
                >
                    {/* Product visual */}
                    <div
                        className="absolute inset-0 flex items-center justify-center select-none
                       text-[88px] transition-transform duration-500
                       group-hover:scale-105"
                        aria-label={product.name}
                    >
                        {product.emoji}
                    </div>

                    {/* Top-left badge */}
                    {product.badge && (
                        <div className="absolute top-3 left-3 z-10">
                            <Badge variant={product.badge}>
                                {product.badge === 'bestseller' ? 'Best Seller' : product.badge}
                            </Badge>
                        </div>
                    )}

                    {/* Top-right: discount + wishlist */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                        {discount > 0 && (
                            <Badge variant="sale">-{discount}%</Badge>
                        )}
                        <button
                            onClick={handleWishToggle}
                            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center',
                                'bg-cream-50/70 backdrop-blur-sm border border-rose-100',
                                'transition-all duration-200',
                                wished
                                    ? 'opacity-100 border-rose-400/30'
                                    : 'opacity-0 group-hover:opacity-100'
                            )}
                        >
                            <Heart
                                size={14}
                                className={cn(
                                    'transition-colors',
                                    wished
                                        ? 'fill-rose-400 text-rose-400'
                                        : 'text-mauve-600 hover:text-rose-400'
                                )}
                            />
                        </button>
                    </div>

                    {/* Bottom quick-add — slides up on hover */}
                    <div
                        className="absolute bottom-0 left-0 right-0 p-3
                       translate-y-full group-hover:translate-y-0
                       transition-transform duration-300 ease-out"
                    >
                        <button
                            onClick={handleQuickAdd}
                            className="w-full bg-cream-50/90 backdrop-blur-sm border border-rose-200
                         hover:border-rose-400/50 text-mauve-800 text-[11px]
                         tracking-[0.08em] uppercase py-2.5 rounded
                         transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={13} />
                            {inCart ? 'Add Another' : 'Quick Add'}
                        </button>
                    </div>
                </div>

                {/* ── Product info ── */}
                <div className="mt-3 space-y-1 px-0.5">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-mauve-500">
                        {product.brand}
                    </p>
                    <h3 className="text-sm text-mauve-700 group-hover:text-mauve-800 transition-colors line-clamp-1 font-medium">
                        {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="font-serif text-base text-rose-400">
                            {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                            <span className="text-xs text-mauve-400 line-through">
                                {formatPrice(product.compareAtPrice)}
                            </span>
                        )}
                    </div>
                    <StarRating
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        size="xs"
                    />
                </div>
            </Link>
        </motion.article>
    )
}