import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductCard } from '@/components/shared/ProductCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/Button'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useCart } from '@/features/cart/hooks/useCart'
import { ROUTES } from '@/lib/constants/routes'
import toast from 'react-hot-toast'

export function Wishlist() {
    const navigate = useNavigate()
    const { wishlistProducts, count, remove: _remove, clear } = useWishlist()
    const { addToCart } = useCart()

    function handleMoveAllToBag() {
        wishlistProducts.forEach((p) =>
            addToCart(p, p.sizes[0], p.colors[0]?.name ?? 'Default')
        )
        clear()
        toast.success(`${count} items moved to your bag!`)
    }

    return (
        <PageWrapper title="My Wishlist" description="Your saved luxury pieces.">

            {/* Breadcrumb */}
            <div className="border-b border-rose-100">
                <div className="container-app py-3">
                    <Breadcrumb items={[{ label: 'Wishlist' }]} />
                </div>
            </div>

            <div className="container-app py-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="heading-section flex items-center gap-3">
                            <Heart size={28} className="text-rose-400" />
                            Your <em className="text-rose-400 not-italic">Wishlist</em>
                        </h1>
                        {count > 0 && (
                            <p className="text-mauve-400 text-sm mt-1.5">
                                {count} saved {count === 1 ? 'piece' : 'pieces'}
                            </p>
                        )}
                    </div>

                    {count > 0 && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<Trash2 size={14} />}
                                onClick={() => {
                                    clear()
                                    toast('Wishlist cleared', { icon: '🗑️' })
                                }}
                            >
                                Clear All
                            </Button>
                            <Button size="sm" onClick={handleMoveAllToBag}>
                                Move All to Bag
                            </Button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {count === 0 ? (
                    <EmptyState
                        icon={<Heart size={48} />}
                        title="Nothing saved yet"
                        description="Browse our collection and save the pieces you love. They'll be waiting here for you."
                        action={{
                            label: 'Browse Collection',
                            onClick: () => navigate(ROUTES.SHOP),
                        }}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
                    >
                        {wishlistProducts.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={i}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </PageWrapper>
    )
}