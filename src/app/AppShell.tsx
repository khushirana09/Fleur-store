import { AppProviders } from '../providers'
import { AppRouter } from '../routes'

export function AppShell() {
    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    )
}