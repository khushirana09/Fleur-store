import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Wrap any route that requires the user to be logged in.
 * Saves the attempted URL so we can redirect back after login.
 *
 * Usage in router:
 *   { element: <ProtectedRoute />, children: [{ path: '/profile', element: <Profile /> }] }
 */
export function ProtectedRoute() {
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
    const location = useLocation()

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                state={{ from: location }}   // remember where they were going
                replace
            />
        )
    }

    return <Outlet />
}