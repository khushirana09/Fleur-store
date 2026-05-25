import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

/**
 * RootLayout wraps every route with:
 *  - ScrollRestoration (back/forward scroll position)
 *  - Fixed Navbar  (pt-16 offset on main)
 *  - ErrorBoundary (catches page-level render errors)
 *  - Footer
 */
export function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-cream-50">
            <ScrollRestoration />
            <Navbar />

            {/* pt-16 offsets the fixed navbar height */}
            <main className="flex-1 pt-16">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>

            <Footer />
        </div>
    )
}