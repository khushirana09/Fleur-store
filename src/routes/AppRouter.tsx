import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { Home } from '@/pages/Home/Home'
import { Login } from '@/pages/Auth/Login'
import { Register } from '@/pages/Auth/Register'
import { Shop } from '@/pages/Shop/Shop'
import { ProductDetail } from '@/pages/ProductDetail/ProductDetail'
import { Checkout } from '@/pages/Checkout/Checkout'
import { Wishlist } from '@/pages/Wishlist/Wishlist'
import { Profile } from '@/pages/Profile/Profile'
import { NotFound } from '@/pages/NotFound/NotFound'
import { VerifyEmail } from '@/pages/Auth/VerifyEmail'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />
    return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    if (isAuthenticated) return <Navigate to="/" replace />
    return <>{children}</>
}

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/auth/verify" element={<VerifyEmail />} />

                <Route path="/auth/login" element={
                    <GuestRoute><Login /></GuestRoute>
                } />
                <Route path="/auth/register" element={
                    <GuestRoute><Register /></GuestRoute>
                } />

                <Route path="/checkout" element={
                    <ProtectedRoute><Checkout /></ProtectedRoute>
                } />

                {/* ── Profile with optional tab param ── */}
                <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/profile/:tab" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}