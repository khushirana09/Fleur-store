import { PageWrapper } from '../../components/layout/PageWrapper'
import { AuthForm } from '../../features/auth'

export function AuthPage() {
    return (
        <PageWrapper description="Authentication page scaffold for sign in and sign up flows." title="Auth">
            <AuthForm />
        </PageWrapper>
    )
}