import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft, Lock } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCart } from '@/features/cart/hooks/useCart'
import { useCheckout } from '@/features/checkout/hooks/useCheckout'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setShippingMethod, setPaymentMethod } from '@/features/checkout/checkoutSlice'
import { shippingSchema, type ShippingFormData } from '@/lib/utils/validators'
import { formatPrice } from '@/lib/utils/currency'
import { INDIAN_STATES, SHIPPING_OPTIONS_DATA } from './checkoutConfig'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

const STEPS = ['Information', 'Shipping', 'Payment']

const PAYMENT_OPTIONS = [
    { value: 'card', icon: '💳', label: 'Credit / Debit Card' },
    { value: 'upi', icon: '📱', label: 'UPI Payment' },
    { value: 'netbanking', icon: '🏦', label: 'Net Banking' },
    { value: 'cod', icon: '💵', label: 'Cash on Delivery' },
]

export function Checkout() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { items, summary } = useCart()
    const { step, shippingData, shippingMethod, paymentMethod,
        isPlacingOrder, goToStep, handleShippingSubmit, placeOrder } = useCheckout()
    const checkout = useAppSelector((s) => s.checkout)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
        defaultValues: shippingData ?? {},
    })

    const stepIndex = { information: 0, shipping: 1, payment: 2, review: 3 }[step]

    if (items.length === 0) {
        return (
            <PageWrapper title="Checkout">
                <div className="container-app py-20">
                    <EmptyState
                        icon="☐"
                        title="Your bag is empty"
                        description="Add some items to your bag before proceeding to checkout."
                        action={{ label: 'Browse Collection', onClick: () => navigate(ROUTES.SHOP) }}
                    />
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper title="Checkout">
            <div className="border-b border-rose-100">
                <div className="container-app py-3">
                    <Breadcrumb items={[{ label: 'Cart' }, { label: 'Checkout' }]} />
                </div>
            </div>

            <div className="container-app py-10">
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-0 mb-12 max-w-sm mx-auto">
                    {STEPS.map((label, i) => {
                        const done = i < stepIndex
                        const active = i === stepIndex
                        return (
                            <div key={label} className="flex items-center">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all',
                                        done ? 'bg-rose-400 text-white' :
                                            active ? 'bg-cream-100 border-2 border-rose-400 text-rose-400' :
                                                'bg-cream-100 border border-rose-100 text-mauve-400'
                                    )}>
                                        {done ? <Check size={14} /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        'text-[10px] tracking-wider uppercase',
                                        active ? 'text-mauve-700' : 'text-mauve-400'
                                    )}>{label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        'h-px w-16 mx-2 mb-5 transition-colors',
                                        done ? 'bg-rose-400' : 'bg-cream-200'
                                    )} />
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-14">

                    {/* ── Left: step content ── */}
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.25 }}
                            >

                                {/* STEP 1: Information */}
                                {step === 'information' && (
                                    <form onSubmit={handleSubmit(handleShippingSubmit)} className="space-y-6">
                                        <h2 className="font-serif text-2xl font-light">Contact Information</h2>

                                        <div className="bg-cream-100 border border-rose-100 rounded-xl p-6 space-y-5">
                                            <h3 className="text-sm font-medium text-mauve-700">Contact Details</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input label="First Name" error={errors.firstName?.message} required
                                                    {...register('firstName')} />
                                                <Input label="Last Name" error={errors.lastName?.message} required
                                                    {...register('lastName')} />
                                            </div>
                                            <Input label="Email Address" type="email" error={errors.email?.message} required
                                                {...register('email')} />
                                            <Input label="Phone Number" type="tel" error={errors.phone?.message} required
                                                placeholder="+91 98765 43210" {...register('phone')} />
                                        </div>

                                        <div className="bg-cream-100 border border-rose-100 rounded-xl p-6 space-y-5">
                                            <h3 className="text-sm font-medium text-mauve-700">Shipping Address</h3>
                                            <Input label="Street Address" error={errors.street?.message} required
                                                placeholder="123 MG Road, Apartment 4B" {...register('street')} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input label="City" error={errors.city?.message} required
                                                    {...register('city')} />
                                                <Input label="PIN Code" error={errors.pinCode?.message} required
                                                    maxLength={6} {...register('pinCode')} />
                                            </div>
                                            <Select
                                                label="State"
                                                error={errors.state?.message}
                                                placeholder="Select state"
                                                options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                                                {...register('state')}
                                            />
                                        </div>

                                        <Button type="submit" fullWidth size="lg" rightIcon={<ChevronRight size={16} />}>
                                            Continue to Shipping
                                        </Button>
                                    </form>
                                )}

                                {/* STEP 2: Shipping method */}
                                {step === 'shipping' && (
                                    <div className="space-y-6">
                                        <h2 className="font-serif text-2xl font-light">Shipping Method</h2>
                                        <div className="bg-cream-100 border border-rose-100 rounded-xl p-6 space-y-3">
                                            {SHIPPING_OPTIONS_DATA.map((opt) => (
                                                <label
                                                    key={opt.value}
                                                    className={cn(
                                                        'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all',
                                                        shippingMethod === opt.value
                                                            ? 'border-rose-400 bg-rose-400/5'
                                                            : 'border-rose-100 hover:border-rose-200'
                                                    )}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        value={opt.value}
                                                        checked={shippingMethod === opt.value}
                                                        onChange={() => dispatch(setShippingMethod(opt.value as any))}
                                                        className="accent-rose-400"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-mauve-700">{opt.label}</p>
                                                        <p className="text-xs text-mauve-400 mt-0.5">{opt.description}</p>
                                                    </div>
                                                    <span className={cn(
                                                        'text-sm font-medium',
                                                        opt.price === 0 ? 'text-green-400' : 'text-mauve-700'
                                                    )}>
                                                        {opt.price === 0 ? 'Free' : formatPrice(opt.price)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="secondary" size="lg"
                                                leftIcon={<ChevronLeft size={16} />}
                                                onClick={() => goToStep('information')}>
                                                Back
                                            </Button>
                                            <Button fullWidth size="lg" rightIcon={<ChevronRight size={16} />}
                                                onClick={() => goToStep('payment')}>
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Payment */}
                                {step === 'payment' && (
                                    <div className="space-y-6">
                                        <h2 className="font-serif text-2xl font-light">Payment Method</h2>
                                        <div className="bg-cream-100 border border-rose-100 rounded-xl p-6 space-y-3">
                                            {PAYMENT_OPTIONS.map((opt) => (
                                                <label
                                                    key={opt.value}
                                                    className={cn(
                                                        'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all',
                                                        paymentMethod === opt.value
                                                            ? 'border-rose-400 bg-rose-400/5'
                                                            : 'border-rose-100 hover:border-rose-200'
                                                    )}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value={opt.value}
                                                        checked={paymentMethod === opt.value}
                                                        onChange={() => dispatch(setPaymentMethod(opt.value as any))}
                                                        className="accent-rose-400"
                                                    />
                                                    <span className="text-xl">{opt.icon}</span>
                                                    <span className="text-sm text-mauve-700">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Card form */}
                                        {paymentMethod === 'card' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-cream-100 border border-rose-100 rounded-xl p-6 space-y-4"
                                            >
                                                <Input label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19} />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input label="Expiry Date" placeholder="MM / YY" />
                                                    <Input label="CVV" placeholder="•••" type="password" maxLength={4} />
                                                </div>
                                                <Input label="Name on Card" placeholder="Alex Sharma" />
                                            </motion.div>
                                        )}

                                        {/* UPI form */}
                                        {paymentMethod === 'upi' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="bg-cream-100 border border-rose-100 rounded-xl p-6"
                                            >
                                                <Input label="UPI ID" placeholder="yourname@paytm" />
                                            </motion.div>
                                        )}

                                        {/* Trust line */}
                                        <div className="flex items-center gap-2 text-[11px] text-mauve-400">
                                            <Lock size={11} />
                                            Your payment information is encrypted and secure
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="secondary" size="lg"
                                                leftIcon={<ChevronLeft size={16} />}
                                                onClick={() => goToStep('shipping')}>
                                                Back
                                            </Button>
                                            <Button
                                                fullWidth size="lg"
                                                isLoading={isPlacingOrder}
                                                onClick={placeOrder}
                                                leftIcon={<Lock size={16} />}
                                            >
                                                Place Order — {formatPrice(summary.total)}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Right: order summary ── */}
                    <div>
                        <div className="bg-cream-100 border border-rose-100 rounded-xl p-6 sticky top-24">
                            <h3 className="font-serif text-lg font-light mb-5">Order Summary</h3>

                            {/* Items */}
                            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.key} className="flex items-center gap-3">
                                        <div className="w-12 h-14 bg-cream-200 rounded flex items-center
                                    justify-center text-2xl flex-shrink-0">
                                            {item.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-mauve-700 truncate">{item.name}</p>
                                            <p className="text-[11px] text-mauve-400 mt-0.5">
                                                Size {item.size} · Qty {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-serif text-sm text-rose-400 flex-shrink-0">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-rose-100 pt-4 space-y-2.5">
                                <div className="flex justify-between text-sm text-mauve-500">
                                    <span>Subtotal</span><span>{formatPrice(summary.subtotal)}</span>
                                </div>
                                {summary.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-400">
                                        <span>Discount</span><span>−{formatPrice(summary.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-mauve-500">
                                    <span>Shipping</span>
                                    <span className={summary.shipping === 0 ? 'text-green-400' : ''}>
                                        {summary.shipping === 0 ? 'Free' : formatPrice(summary.shipping)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-mauve-500">
                                    <span>GST (18%)</span><span>{formatPrice(summary.tax)}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-rose-100">
                                    <span className="font-medium text-mauve-700">Total</span>
                                    <span className="font-serif text-xl text-rose-400">
                                        {formatPrice(summary.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    )
}