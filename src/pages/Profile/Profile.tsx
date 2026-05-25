import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useOrders } from '@/features/profile/hooks/useOrders'
import { profileSchema, type ProfileFormData } from '@/lib/utils/validators'
import { formatPrice } from '@/lib/utils/currency'
import { productPath, ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'
import { format } from 'date-fns'
import type { OrderStatus } from '@/types/order.types'

/* ─── Sidebar nav config ─────────────────────────────────── */
const TABS = [
    { key: 'orders', label: 'My Orders', icon: Package },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
    { key: 'settings', label: 'Settings', icon: Settings },
]

/* ─── Status badge map ───────────────────────────────────── */
const STATUS_BADGE: Record<OrderStatus, 'success' | 'info' | 'warning' | 'default'> = {
    delivered: 'success',
    shipped: 'info',
    processing: 'warning',
    pending: 'default',
    cancelled: 'error' as any,
}

/* ─── Component ─────────────────────────────────────────── */
export function Profile() {
    const { tab = 'orders' } = useParams<{ tab?: string }>()
    const navigate = useNavigate()
    const { user, logout, updateProfile, isLoading } = useAuth()
    const { wishlistProducts } = useWishlist()
    const { data: orders = [], isLoading: ordersLoading } = useOrders()

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            email: user?.email ?? '',
            phone: user?.phone ?? '',
        },
    })

    const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`

    return (
        <PageWrapper title="My Account">
            <div className="border-b border-rose-100">
                <div className="container-app py-3">
                    <Breadcrumb items={[{ label: 'My Account' }]} />
                </div>
            </div>

            <div className="container-app py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-60 flex-shrink-0">
                        {/* Avatar */}
                        <div className="flex flex-col items-center lg:items-start gap-3 mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 to-rose-400
                              flex items-center justify-center font-serif text-2xl text-white font-light">
                                {initials}
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="font-medium text-mauve-700">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-sm text-mauve-400 mt-0.5">{user?.email}</p>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                            {TABS.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => navigate(`/profile/${key}`)}
                                    className={cn(
                                        'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm',
                                        'transition-colors whitespace-nowrap',
                                        tab === key
                                            ? 'bg-rose-400/10 text-rose-400'
                                            : 'text-mauve-500 hover:text-mauve-700 hover:bg-cream-100'
                                    )}
                                >
                                    <Icon size={16} className="flex-shrink-0" />
                                    {label}
                                </button>
                            ))}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm
                           text-red-500 hover:text-red-400 hover:bg-red-900/10 transition-colors mt-2"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* ── Content panel ── */}
                    <div className="flex-1 min-w-0">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="bg-cream-100 border border-rose-100 rounded-xl p-6"
                        >

                            {/* ORDERS TAB */}
                            {tab === 'orders' && (
                                <div>
                                    <h2 className="font-serif text-2xl font-light mb-6">
                                        Order <em className="text-rose-400 not-italic">History</em>
                                    </h2>

                                    {ordersLoading ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} className="h-20 w-full" />
                                            ))}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-12 text-mauve-400">
                                            <Package size={40} className="mx-auto mb-3 opacity-40" />
                                            <p>No orders yet.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-rose-100">
                                            {orders.map((order) => (
                                                <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono text-sm text-mauve-700">#{order.id}</span>
                                                            <Badge variant={STATUS_BADGE[order.status] ?? 'default'} size="sm">
                                                                {order.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[11px] text-mauve-400 mt-1">
                                                            {format(new Date(order.createdAt), 'dd MMM yyyy')} ·{' '}
                                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                        </p>
                                                        <div className="flex gap-1.5 mt-2">
                                                            {order.items.slice(0, 3).map((item, i) => (
                                                                <span key={i} className="text-xl" title={item.name}>{item.emoji}</span>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <span className="text-mauve-400 text-sm self-center">+{order.items.length - 3}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-serif text-lg text-rose-400">
                                                            {formatPrice(order.total)}
                                                        </span>
                                                        <button className="flex items-center gap-1 text-[11px] text-mauve-500
                                               hover:text-mauve-700 transition-colors uppercase tracking-wider">
                                                            Details <ChevronRight size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* WISHLIST TAB */}
                            {tab === 'wishlist' && (
                                <div>
                                    <h2 className="font-serif text-2xl font-light mb-6">
                                        Saved <em className="text-rose-400 not-italic">Pieces</em>
                                    </h2>
                                    {wishlistProducts.length === 0 ? (
                                        <div className="text-center py-12 text-mauve-400">
                                            <Heart size={40} className="mx-auto mb-3 opacity-40" />
                                            <p>Nothing saved yet.</p>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="mt-4"
                                                onClick={() => navigate(ROUTES.SHOP)}
                                            >
                                                Browse Collection
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {wishlistProducts.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={productPath(product.slug)}
                                                    className="group"
                                                >
                                                    <div className="aspect-[3/4] bg-cream-200 rounded-lg flex items-center
                                          justify-center text-5xl mb-2 overflow-hidden
                                          group-hover:border-rose-200 border border-rose-100
                                          transition-colors">
                                                        {product.emoji}
                                                    </div>
                                                    <p className="text-[10px] text-mauve-400 uppercase tracking-wider">{product.brand}</p>
                                                    <p className="text-xs text-mauve-700 mt-0.5 line-clamp-1">{product.name}</p>
                                                    <p className="font-serif text-sm text-rose-400 mt-0.5">
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SETTINGS TAB */}
                            {tab === 'settings' && (
                                <div>
                                    <h2 className="font-serif text-2xl font-light mb-6">
                                        Account <em className="text-rose-400 not-italic">Settings</em>
                                    </h2>
                                    <form
                                        onSubmit={handleSubmit(updateProfile)}
                                        className="space-y-5 max-w-lg"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input
                                                label="First Name"
                                                error={errors.firstName?.message}
                                                {...register('firstName')}
                                            />
                                            <Input
                                                label="Last Name"
                                                error={errors.lastName?.message}
                                                {...register('lastName')}
                                            />
                                        </div>
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            error={errors.email?.message}
                                            {...register('email')}
                                        />
                                        <Input
                                            label="Phone Number"
                                            type="tel"
                                            error={errors.phone?.message}
                                            {...register('phone')}
                                        />
                                        <div className="pt-2">
                                            <Button
                                                type="submit"
                                                isLoading={isLoading}
                                                disabled={!isDirty}
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Danger zone */}
                                    <div className="mt-12 pt-6 border-t border-rose-100">
                                        <h3 className="text-sm font-medium text-mauve-600 mb-4">Account Actions</h3>
                                        <Button variant="danger" size="sm" onClick={logout}>
                                            Sign Out of All Devices
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </div>

                </div>
            </div>
        </PageWrapper>
    )
}