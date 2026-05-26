import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Minus, Plus, Share2, Check } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { StarRating } from '@/components/shared/StarRating'
import { ProductCard } from '@/components/shared/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProductDetailSkeleton, ProductCardSkeleton } from '@/components/ui/Skeleton'
import { useProduct, useRelatedProducts } from '@/features/products/hooks/useProducts'
import { useCart } from '@/features/cart/hooks/useCart'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { formatPrice, calculateDiscount } from '@/lib/utils/currency'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

type TabKey = 'description' | 'details' | 'shipping'

const TABS: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Description' },
    { key: 'details', label: 'Details & Care' },
    { key: 'shipping', label: 'Shipping & Returns' },
]

export function ProductDetail() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()

    // ── ALL hooks must come first ──
    const { data: product, isLoading, isError } = useProduct(slug ?? '')
    const { data: related = [], isLoading: relLoading } = useRelatedProducts(product?.id ?? '')
    const { addToCart } = useCart()
    const { toggle, isWished } = useWishlist()
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState<TabKey>('description')
    const [activeThumb, setActiveThumb] = useState(0)
    const [justAdded, setJustAdded] = useState(false)

    // ── Early returns AFTER all hooks ──
    if (isLoading) return (
        <div className="container-app py-12">
            <ProductDetailSkeleton />
        </div>
    )

    if (isError) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-mauve-500">Product not found.</p>
            <Button onClick={() => navigate(ROUTES.SHOP)}>Back to Shop</Button>
        </div>
    )

    if (!product) return <div>Product not found</div>

    const wished = isWished(product.id)
    const discount = product.compareAtPrice
        ? calculateDiscount(product.price, product.compareAtPrice)
        : 0

    /* Gallery thumbnails — use emoji variants as placeholders */
    const thumbs = ['🖼️', product.emoji, '📐', '✦'].map((e) => e)

    function handleAddToCart() {
        if (!selectedSize) {
            toast.error('Please select a size', { id: 'size-warning' })
            return
        }
        addToCart(product, selectedSize, product.colors[selectedColor]?.name ?? 'Default', quantity)
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2000)
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard')
    }

    const tabContent: Record<TabKey, React.ReactNode> = {
        description: (
            <p className="text-mauve-500 text-sm leading-relaxed">{product.description}</p>
        ),
        details: (
            <ul className="space-y-2.5">
                {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-mauve-500">
                        <span className="text-rose-400 mt-0.5 flex-shrink-0">✦</span>
                        {d}
                    </li>
                ))}
            </ul>
        ),
        shipping: (
            <div className="space-y-3 text-sm text-mauve-500">
                {[
                    ['🚚', 'Free standard shipping on orders above ₹10,000 (5–7 days)'],
                    ['⚡', 'Express delivery available — ₹299 (2–3 days)'],
                    ['↩', '30-day hassle-free returns — no questions asked'],
                    ['📦', 'All orders are tracked and insured'],
                ].map(([icon, text]) => (
                    <div key={text} className="flex items-start gap-3">
                        <span aria-hidden="true">{icon}</span>
                        <span>{text}</span>
                    </div>
                ))}
            </div>
        ),
    }

    return (
        <PageWrapper
            title={product.name}
            description={product.description.slice(0, 155)}
        >
            {/* Breadcrumb */}
            <div className="border-b border-rose-100">
                <div className="container-app py-3">
                    <Breadcrumb
                        items={[
                            { label: 'Shop', href: ROUTES.SHOP },
                            {
                                label: product.category.charAt(0).toUpperCase() + product.category.slice(1),
                                href: `${ROUTES.SHOP}?category=${product.category}`
                            },
                            { label: product.name },
                        ]}
                    />
                </div>
            </div>

            {/* Main grid */}
            <div className="container-app py-10 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* ── Gallery ── */}
                    <div className="space-y-3">
                        {/* Main image */}
                        <motion.div
                            key={activeThumb}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="aspect-[4/5] bg-cream-100 border border-rose-100 rounded-xl
                         flex items-center justify-center overflow-hidden relative"
                        >
                            <span className="text-[160px] select-none" aria-label={product.name}>
                                {product.emoji}
                            </span>
                            {/* Badges overlay */}
                            {product.badge && (
                                <div className="absolute top-4 left-4">
                                    <Badge variant={product.badge}>
                                        {product.badge === 'bestseller' ? 'Best Seller' : product.badge}
                                    </Badge>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="absolute top-4 right-4">
                                    <Badge variant="sale">−{discount}%</Badge>
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2">
                            {thumbs.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveThumb(i)}
                                    aria-label={`View image ${i + 1}`}
                                    className={cn(
                                        'aspect-square bg-cream-100 rounded-lg flex items-center justify-center',
                                        'text-3xl border-2 transition-colors duration-200',
                                        activeThumb === i
                                            ? 'border-rose-400'
                                            : 'border-rose-100 hover:border-rose-200'
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Product info ── */}
                    <div className="space-y-6 lg:pt-4">

                        {/* Brand */}
                        <p className="text-label text-rose-400">{product.brand}</p>

                        {/* Name */}
                        <h1 className="font-serif font-light text-mauve-800"
                            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1.08 }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <StarRating
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            size="md"
                            showNumber
                        />

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="font-serif text-3xl text-rose-400">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <>
                                    <span className="text-lg text-mauve-400 line-through">
                                        {formatPrice(product.compareAtPrice)}
                                    </span>
                                    <span className="text-sm text-red-400 font-medium">
                                        {discount}% off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stock notice */}
                        {product.stockCount <= 10 && (
                            <p className="text-sm text-amber-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                Only {product.stockCount} left in stock
                            </p>
                        )}

                        {/* Color selector */}
                        {product.colors.length > 0 && (
                            <div className="space-y-2.5">
                                <p className="text-[11px] tracking-[0.08em] uppercase text-mauve-600">
                                    Color —{' '}
                                    <span className="text-mauve-700">
                                        {product.colors[selectedColor]?.name}
                                    </span>
                                </p>
                                <div className="flex items-center gap-2.5">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(i)}
                                            aria-label={color.name}
                                            title={color.name}
                                            className={cn(
                                                'w-8 h-8 rounded-full border-2 transition-all duration-200',
                                                selectedColor === i
                                                    ? 'border-rose-400 scale-110'
                                                    : 'border-transparent hover:border-rose-200'
                                            )}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size selector */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] tracking-[0.08em] uppercase text-mauve-600">
                                    Size{selectedSize ? ` — ${selectedSize}` : ''}
                                </p>
                                <button className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors">
                                    Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        aria-pressed={selectedSize === size}
                                        className={cn(
                                            'min-w-[44px] h-11 px-3 rounded border text-sm transition-all duration-200',
                                            selectedSize === size
                                                ? 'bg-rose-400 border-rose-400 text-white font-medium'
                                                : 'border-rose-100 text-mauve-600 hover:border-rose-200 hover:text-mauve-700'
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p className="text-[11px] text-mauve-400">Please select a size to continue</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <p className="text-[11px] tracking-[0.08em] uppercase text-mauve-600">Quantity</p>
                            <div className="flex items-center border border-rose-100 rounded overflow-hidden">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                    className="w-10 h-10 flex items-center justify-center text-mauve-500
                             hover:bg-cream-200 hover:text-mauve-700 transition-colors
                             disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 h-10 flex items-center justify-center text-sm tabular-nums">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                                    disabled={quantity >= 10}
                                    aria-label="Increase quantity"
                                    className="w-10 h-10 flex items-center justify-center text-mauve-500
                             hover:bg-cream-200 hover:text-mauve-700 transition-colors
                             disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                fullWidth
                                size="lg"
                                onClick={handleAddToCart}
                                leftIcon={justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
                                className={cn(justAdded && 'bg-green-600 hover:bg-green-500')}
                            >
                                {justAdded
                                    ? 'Added to Bag!'
                                    : `Add to Bag — ${formatPrice(product.price * quantity)}`}
                            </Button>
                            <Button
                                fullWidth
                                size="lg"
                                variant="secondary"
                                onClick={() => {
                                    toggle(product.id)
                                    toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', {
                                        icon: wished ? '♡' : '♥',
                                    })
                                }}
                                leftIcon={
                                    <Heart
                                        size={16}
                                        className={wished ? 'fill-rose-400 text-rose-400' : ''}
                                    />
                                }
                            >
                                {wished ? 'Saved to Wishlist' : 'Add to Wishlist'}
                            </Button>
                        </div>

                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-[11px] tracking-[0.06em]
                         text-mauve-400 hover:text-mauve-600 transition-colors"
                        >
                            <Share2 size={12} />
                            Share this product
                        </button>

                        {/* Tabs */}
                        <div className="border-t border-rose-100 pt-6">
                            <div className="flex gap-0 border-b border-rose-100 mb-5">
                                {TABS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        aria-selected={activeTab === key}
                                        className={cn(
                                            'px-5 py-2.5 text-[12px] tracking-[0.06em] uppercase transition-colors',
                                            activeTab === key
                                                ? 'border-b-2 border-rose-400 text-rose-400'
                                                : 'text-mauve-500 hover:text-mauve-700 border-b-2 border-transparent'
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {tabContent[activeTab]}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {(related.length > 0 || relLoading) && (
                    <section className="mt-20 pt-12 border-t border-rose-100">
                        <h2 className="heading-section mb-8">
                            You May <em className="text-rose-400 not-italic">Also Like</em>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                            {relLoading
                                ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
                                : related.slice(0, 4).map((p, i) => (
                                    <ProductCard key={p.id} product={p} index={i} />
                                ))}
                        </div>
                    </section>
                )}
            </div>
        </PageWrapper>
    )
}