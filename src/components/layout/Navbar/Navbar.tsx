import { useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Heart, User, X, Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '@/features/cart/hooks/useCart'
import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAppDispatch } from '@/app/hooks'
import { setSearchQuery } from '@/features/products/productsSlice'
import { useDebounce } from '@/hooks/useDebounce'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'
import { CartDrawer } from './CartDrawer'

const NAV_LINKS = [
    { label: 'New In', href: `${ROUTES.SHOP}?sort=newest` },
    { label: 'Kurtas & Suits', href: `${ROUTES.SHOP}?category=kurtas` },
    { label: 'Dresses', href: `${ROUTES.SHOP}?category=dresses` },
    { label: 'Sarees', href: `${ROUTES.SHOP}?category=sarees` },
    { label: 'Sale 🔥', href: `${ROUTES.SHOP}?sort=price-asc` },
]

export function Navbar() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { summary } = useCart()
    const { count: wishCount } = useWishlist()
    const { isAuthenticated } = useAuth()

    const [cartOpen, setCartOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const searchRef = useRef<HTMLDivElement>(null)
    useClickOutside<HTMLDivElement>(searchRef, () => setSearchOpen(false), searchOpen)
    const debouncedSearch = useDebounce(searchValue, 400)

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault()
        const q = debouncedSearch.trim()
        if (!q) return
        dispatch(setSearchQuery(q))
        navigate(ROUTES.SHOP)
        setSearchOpen(false)
        setSearchValue('')
        setMobileOpen(false)
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md
                         border-b border-rose-100 safe-top">

                {/* ── Announcement bar — single line, no wrap on any device ── */}
                <div className="bg-rose-500 text-white text-center py-1.5 px-4 overflow-hidden">
                    <p className="text-[10px] sm:text-[11px] tracking-[0.06em] whitespace-nowrap
                        overflow-hidden text-ellipsis">
                        🌸 Free delivery above ₹999 &nbsp;·&nbsp; Code{' '}
                        <strong>FLEUR10</strong> for 10% off your first order
                    </p>
                </div>

                {/* ── Main nav bar ── */}
                <div className="container-app h-14 flex items-center gap-2 sm:gap-4">

                    {/* Logo */}
                    <Link
                        to={ROUTES.HOME}
                        className="flex items-center gap-1.5 flex-shrink-0"
                        aria-label="Fleur — Go to homepage"
                    >
                        <span className="text-xl sm:text-2xl">🌸</span>
                        <span className="font-serif text-lg sm:text-xl text-rose-700 font-normal tracking-wide">
                            Fleur
                        </span>
                    </Link>

                    {/* Desktop nav — hidden below lg */}
                    <nav className="hidden lg:flex items-center gap-5 flex-1 ml-4">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.href}
                                className={({ isActive }) => {
                                    // Also highlight when on /shop regardless of query params
                                    const onShop = link.href.startsWith('/shop') && window.location.pathname === '/shop'
                                    return cn('nav-link whitespace-nowrap', (isActive || onShop) && 'nav-link-active')
                                }}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Action buttons */}
                    <div className="flex items-center gap-0 sm:gap-0.5 ml-auto">

                        {/* Search */}
                        <div ref={searchRef} className="relative">
                            <button
                                onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false) }}
                                aria-label={searchOpen ? 'Close search' : 'Search'}
                                className="nav-action-btn"
                            >
                                {searchOpen ? <X size={18} /> : <Search size={18} />}
                            </button>

                            <AnimatePresence>
                                {searchOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 bg-white border
                               border-rose-100 rounded-2xl shadow-xl overflow-hidden z-50
                               /* Mobile: almost full width; desktop: fixed width */
                               w-[calc(100vw-2rem)] sm:w-80
                               /* Ensure it doesn't go off-screen left */
                               max-w-sm"
                                        style={{ right: 0 }}
                                    >
                                        <form onSubmit={handleSearchSubmit}>
                                            <div className="flex items-center gap-2 px-4 py-3">
                                                <Search size={15} className="text-rose-300 flex-shrink-0" />
                                                <input
                                                    autoFocus
                                                    type="search"
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    placeholder="Search kurtas, dresses…"
                                                    className="flex-1 text-sm text-mauve-900 placeholder:text-mauve-300
                                     focus:outline-none bg-transparent"
                                                    style={{ fontSize: '16px' }}   /* prevent iOS zoom */
                                                />
                                                {searchValue && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSearchValue('')}
                                                        className="text-mauve-400 hover:text-mauve-700 flex-shrink-0"
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="border-t border-rose-50 px-4 py-3">
                                                <p className="text-[10px] tracking-[0.1em] uppercase text-mauve-400 mb-2">
                                                    Popular
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {['Anarkali', 'Saree', 'Coord Set', 'Lehenga', 'Floral Dress'].map((s) => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => {
                                                                dispatch(setSearchQuery(s))
                                                                navigate(ROUTES.SHOP)
                                                                setSearchOpen(false)
                                                                setSearchValue('')
                                                            }}
                                                            className="px-3 py-1 bg-rose-50 rounded-full text-[11px]
                                         text-rose-600 hover:bg-rose-100 transition-colors
                                         border border-rose-100"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Wishlist — hidden on very small screens, show on sm+ */}
                        <Link
                            to={ROUTES.WISHLIST}
                            className="nav-action-btn hidden xs:flex sm:flex"
                            aria-label={`Wishlist${wishCount > 0 ? ` (${wishCount})` : ''}`}
                        >
                            <Heart size={18} />
                            {wishCount > 0 && <span className="nav-badge">{wishCount}</span>}
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => { setCartOpen(true); setMobileOpen(false) }}
                            className="nav-action-btn"
                            aria-label={`Bag${summary.itemCount > 0 ? ` (${summary.itemCount})` : ''}`}
                        >
                            <ShoppingBag size={18} />
                            {summary.itemCount > 0 && (
                                <span className="nav-badge">{summary.itemCount}</span>
                            )}
                        </button>

                        {/* Account — hidden on xs */}
                        <Link
                            to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
                            className="nav-action-btn hidden sm:flex"
                            aria-label={isAuthenticated ? 'My account' : 'Sign in'}
                        >
                            <User size={18} />
                        </Link>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false) }}
                            className="nav-action-btn lg:hidden"
                            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile navigation drawer ── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden border-t border-rose-100 bg-white overflow-hidden"
                        >
                            <div className="container-app py-3 flex flex-col gap-1">
                                {/* Main links */}
                                {NAV_LINKS.map((link) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={({ isActive }) =>
                                            cn(
                                                'px-4 py-3 rounded-xl text-sm transition-colors',
                                                isActive
                                                    ? 'bg-rose-50 text-rose-600 font-medium'
                                                    : 'text-mauve-600 hover:bg-rose-50 hover:text-rose-600'
                                            )
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}

                                {/* Divider */}
                                <div className="border-t border-rose-100 my-1" />

                                {/* Account links */}
                                <Link
                                    to={ROUTES.WISHLIST}
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm text-mauve-600
                             hover:bg-rose-50 hover:text-rose-600 transition-colors
                             flex items-center gap-2"
                                >
                                    <Heart size={15} /> Wishlist
                                    {wishCount > 0 && (
                                        <span className="ml-auto bg-rose-500 text-white text-[10px]
                                     font-bold rounded-full w-5 h-5 flex items-center
                                     justify-center">
                                            {wishCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-3 rounded-xl text-sm text-mauve-600
                             hover:bg-rose-50 hover:text-rose-600 transition-colors
                             flex items-center gap-2"
                                >
                                    <User size={15} />
                                    {isAuthenticated ? 'My Account' : 'Sign In'}
                                </Link>
                                {!isAuthenticated && (
                                    <Link
                                        to={ROUTES.REGISTER}
                                        onClick={() => setMobileOpen(false)}
                                        className="mx-4 mt-1 mb-2 btn-primary text-center text-[12px] py-3"
                                    >
                                        Create Account 🌸
                                    </Link>
                                )}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    )
}