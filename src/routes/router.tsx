import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { RootLayout } from '@/components/layout/RootLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

/* ─── Lazy-loaded pages (code splitting) ─────────────────
   Each page is its own JS chunk — only loaded when visited.
   This keeps the initial bundle small and fast.
──────────────────────────────────────────────────────────── */
const Home = lazy(() => import('@/pages/Home/Home').then(m => ({ default: m.Home })))
const Shop = lazy(() => import('@/pages/Shop/Shop').then(m => ({ default: m.Shop })))
const ProductDetail = lazy(() => import('@/pages/ProductDetail/ProductDetail').then(m => ({ default: m.ProductDetail })))
const Wishlist = lazy(() => import('@/pages/Wishlist/Wishlist').then(m => ({ default: m.Wishlist })))
const Checkout = lazy(() => import('@/pages/Checkout/Checkout').then(m => ({ default: m.Checkout })))
const CheckoutSuccess = lazy(() => import('@/pages/Checkout/CheckoutSuccess').then(m => ({ default: m.CheckoutSuccess })))
const Profile = lazy(() => import('@/pages/Profile/Profile').then(m => ({ default: m.Profile })))
const Login = lazy(() => import('@/pages/Auth/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/Auth/Register').then(m => ({ default: m.Register })))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound').then(m => ({ default: m.NotFound })))

/* ─── Page-level loading fallback ────────────────────────── */
function PageLoader() {
    return (
        <div className="container-app pt-12">
            <ProductGridSkeleton count={8} />
        </div>
    )
}

function withSuspense(Component: React.ComponentType) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Component />
        </Suspense>
    )
}

/* ─── Router ─────────────────────────────────────────────── */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [

            /* ── Public pages ── */
            { index: true, element: withSuspense(Home) },
            { path: 'shop', element: withSuspense(Shop) },
            { path: 'products/:slug', element: withSuspense(ProductDetail) },
            { path: 'wishlist', element: withSuspense(Wishlist) },

            /* ── Auth pages (redirect to home if already logged in) ── */
            {
                element: <PublicRoute />,
                children: [
                    { path: 'auth/login', element: withSuspense(Login) },
                    { path: 'auth/register', element: withSuspense(Register) },
                ],
            },

            /* ── Protected pages (redirect to login if not logged in) ── */
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'checkout', element: withSuspense(Checkout) },
                    { path: 'checkout/success', element: withSuspense(CheckoutSuccess) },
                    { path: 'profile', element: withSuspense(Profile) },
                    { path: 'profile/:tab', element: withSuspense(Profile) },
                ],
            },

            /* ── 404 ── */
            { path: '*', element: withSuspense(NotFound) },
        ],
    },
])