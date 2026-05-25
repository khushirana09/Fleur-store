import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/features/cart/hooks/useCart'
import { useScrollLock } from '@/hooks/useScrollLock'
import { formatPrice } from '@/lib/utils/currency'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'
import toast from 'react-hot-toast'

interface CartDrawerProps {
    open: boolean
    onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
    const {
        items, summary, promoCode,
        removeFromCart, updateQty,
        applyPromoCode, removePromoCode,
    } = useCart()

    const [promoInput, setPromoInput] = useState('')
    const [promoLoading, setPromoLoading] = useState(false)

    useScrollLock(open)

    async function handleApplyPromo() {
        if (!promoInput.trim()) return
        setPromoLoading(true)
        await new Promise((r) => setTimeout(r, 500))
        const result = applyPromoCode(promoInput)
        if (result.success) toast.success(result.message)
        else toast.error(result.message)
        setPromoInput('')
        setPromoLoading(false)
    }

    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex justify-end"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Shopping bag"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-mauve-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel — FULL width on mobile, max-w-[420px] on sm+ */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                        className="relative h-full bg-white border-l border-rose-100
                       flex flex-col shadow-2xl
                       w-full sm:max-w-[420px]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4
                            border-b border-rose-100 flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag size={18} className="text-rose-400" />
                                <h2 className="font-serif text-xl font-normal text-mauve-900">
                                    Your Bag
                                </h2>
                                {summary.itemCount > 0 && (
                                    <span className="text-mauve-400 text-sm">
                                        ({summary.itemCount})
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close cart"
                                className="w-9 h-9 flex items-center justify-center rounded-full
                           border border-rose-100 text-mauve-400 hover:text-mauve-800
                           hover:bg-rose-50 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-4 space-y-3">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full
                                gap-5 text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center
                                  justify-center text-4xl">
                                        🛍️
                                    </div>
                                    <div>
                                        <p className="font-serif text-xl font-normal text-mauve-600">
                                            Your bag is empty
                                        </p>
                                        <p className="text-mauve-400 text-sm mt-1.5">
                                            Discover our latest collection
                                        </p>
                                    </div>
                                    <Link
                                        to={ROUTES.SHOP}
                                        onClick={onClose}
                                        className="btn-secondary text-[11px] px-6 py-2.5"
                                    >
                                        Browse Collection
                                    </Link>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.key}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex gap-3 bg-rose-50/50 rounded-xl p-3
                               border border-rose-100"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-16 h-20 sm:w-[68px] sm:h-[84px] bg-white rounded-lg
                                    flex items-center justify-center text-3xl
                                    flex-shrink-0 border border-rose-100">
                                            {item.emoji}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] tracking-[0.08em] uppercase text-rose-400 mb-0.5">
                                                {item.brand}
                                            </p>
                                            <p className="text-sm font-medium text-mauve-800 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-mauve-400 mt-0.5">
                                                Size {item.size}
                                                {item.color && item.color !== 'Default' && ` · ${item.color}`}
                                            </p>

                                            {/* Qty controls */}
                                            <div className="flex items-center gap-2 mt-2.5">
                                                <button
                                                    onClick={() => updateQty(item.key, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                    className="w-7 h-7 border border-rose-200 rounded-lg
                                     flex items-center justify-center
                                     hover:bg-rose-100 transition-colors text-mauve-600"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="text-sm w-5 text-center tabular-nums text-mauve-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.key, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                    className="w-7 h-7 border border-rose-200 rounded-lg
                                     flex items-center justify-center
                                     hover:bg-rose-100 transition-colors text-mauve-600"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price + remove */}
                                        <div className="flex flex-col items-end justify-between flex-shrink-0">
                                            <span className="font-serif text-sm text-rose-600 font-normal">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.key)}
                                                aria-label={`Remove ${item.name}`}
                                                className="text-mauve-300 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-rose-100 px-4 sm:px-6 py-4 space-y-4
                              flex-shrink-0 safe-bottom">
                                {/* Promo */}
                                {promoCode ? (
                                    <div className="flex items-center justify-between bg-green-50
                                  border border-green-200 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Tag size={13} className="text-green-500" />
                                            <span className="text-green-600 text-[12px] font-medium">
                                                {promoCode} applied
                                            </span>
                                            <span className="text-green-500 text-[11px]">
                                                (−{formatPrice(summary.discount)})
                                            </span>
                                        </div>
                                        <button
                                            onClick={removePromoCode}
                                            className="text-mauve-400 hover:text-mauve-700 text-[11px]"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            value={promoInput}
                                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                            placeholder="Promo code"
                                            className="flex-1 input-base uppercase tracking-widest py-2.5"
                                            style={{ fontSize: '14px' }}
                                        />
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleApplyPromo}
                                            isLoading={promoLoading}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                )}

                                {/* Price breakdown */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[13px] text-mauve-500">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(summary.subtotal)}</span>
                                    </div>
                                    {summary.discount > 0 && (
                                        <div className="flex justify-between text-[13px] text-green-500">
                                            <span>Discount</span>
                                            <span>−{formatPrice(summary.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[13px] text-mauve-500">
                                        <span>Shipping</span>
                                        <span className={summary.shipping === 0 ? 'text-green-500' : ''}>
                                            {summary.shipping === 0 ? 'Free 🎉' : formatPrice(summary.shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[13px] text-mauve-500">
                                        <span>GST (18%)</span>
                                        <span>{formatPrice(summary.tax)}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-rose-100">
                                        <span className="text-sm font-medium text-mauve-800">Total</span>
                                        <span className="font-serif text-lg text-rose-600">
                                            {formatPrice(summary.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link
                                    to={ROUTES.CHECKOUT}
                                    onClick={onClose}
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                                >
                                    Checkout
                                    <ChevronRight size={15} />
                                </Link>
                                <p className="text-center text-[11px] text-mauve-400">
                                    Free delivery above ₹999 · 7-day returns
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}