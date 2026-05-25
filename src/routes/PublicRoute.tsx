import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Wrap auth routes (login, register) so already-logged-in
 * users get redirected to the home page instead.
 *
 * Usage in router:
 *   { element: <PublicRoute />, children: [{ path: '/auth/login', element: <Login /> }] }
 */
export function PublicRoute() {
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />
    }

    return <Outlet />
}