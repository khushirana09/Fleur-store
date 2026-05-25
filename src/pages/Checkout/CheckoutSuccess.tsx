import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { useAppSelector } from '@/app/hooks'
import { ROUTES } from '@/lib/constants/routes'

export function CheckoutSuccess() {
    const orderId = useAppSelector((s) => s.checkout.orderId)

    return (
        <PageWrapper title="Order Confirmed">
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-md w-full space-y-7"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="flex justify-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-green-900/30 border border-green-800/50
                           flex items-center justify-center">
                            <CheckCircle2 size={48} className="text-green-400" />
                        </div>
                    </motion.div>

                    {/* Text */}
                    <div className="space-y-3">
                        <h1 className="font-serif text-4xl font-light text-mauve-800">
                            Order Confirmed
                        </h1>
                        <p className="text-mauve-500 text-sm leading-relaxed">
                            Thank you for your purchase. Your order has been placed and
                            is being prepared by our team.
                        </p>
                        {orderId && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream-100
                              border border-rose-100 rounded-lg">
                                <Package size={14} className="text-rose-400" />
                                <span className="text-sm text-mauve-600">Order </span>
                                <span className="font-mono text-sm text-rose-400">#{orderId}</span>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-cream-100 border border-rose-100 rounded-xl p-5 text-left space-y-4">
                        <h3 className="text-[11px] tracking-[0.1em] uppercase text-mauve-500">
                            What happens next
                        </h3>
                        {[
                            { icon: '📧', title: 'Confirmation email', desc: 'Sent to your inbox now' },
                            { icon: '📦', title: 'Order processing', desc: 'Within 24 hours' },
                            { icon: '🚚', title: 'Dispatched', desc: '1–2 business days' },
                            { icon: '🎉', title: 'Delivered', desc: '5–7 business days' },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-3">
                                <span className="text-xl w-8 text-center flex-shrink-0">{icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-mauve-700">{title}</p>
                                    <p className="text-[11px] text-mauve-400 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="secondary"
                            fullWidth
                            asChild
                        >
                            <Link to={ROUTES.PROFILE_ORDERS}>
                                Track Order
                            </Link>
                        </Button>
                        <Button
                            fullWidth
                            rightIcon={<ArrowRight size={16} />}
                            asChild
                        >
                            <Link to={ROUTES.SHOP}>
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    )
}