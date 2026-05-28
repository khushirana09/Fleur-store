import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/features/cart/hooks/useCart'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

export function MobileBottomNav() {
    const { pathname } = useLocation()
    const { summary } = useCart()
    const { count: wishCount } = useWishlist()
    const { isAuthenticated } = useAuth()

    const tabs = [
        { icon: Home, label: 'Home', href: ROUTES.HOME },
        { icon: Search, label: 'Shop', href: ROUTES.SHOP },
        { icon: Heart, label: 'Wishlist', href: ROUTES.WISHLIST, badge: wishCount },
        { icon: ShoppingBag, label: 'Bag', href: '#cart', badge: summary.itemCount },
        { icon: User, label: 'Account', href: isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden
                        bg-white/95 backdrop-blur-md border-t border-rose-100
                        safe-bottom">
            <div className="grid grid-cols-5 h-16">
                {tabs.map(({ icon: Icon, label, href, badge }) => {
                    const isActive = href !== '#cart' && (
                        href === '/' ? pathname === '/' : pathname.startsWith(href)
                    )

                    return (
                        <Link
                            key={label}
                            to={href === '#cart' ? '#' : href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 relative',
                                'transition-colors',
                                isActive ? 'text-rose-500' : 'text-mauve-400'
                            )}
                        >
                            <div className="relative">
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                                {badge != null && badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5
                                                     bg-rose-500 text-white text-[9px]
                                                     font-bold rounded-full w-4 h-4
                                                     flex items-center justify-center">
                                        {badge > 9 ? '9+' : badge}
                                    </span>
                                )}
                            </div>
                            <span className={cn(
                                'text-[10px] tracking-wide',
                                isActive ? 'font-medium' : 'font-normal'
                            )}>
                                {label}
                            </span>
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2
                                                 w-6 h-0.5 bg-rose-500 rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}