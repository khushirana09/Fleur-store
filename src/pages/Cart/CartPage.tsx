import { PageWrapper } from '../../components/layout/PageWrapper'
import { CartSummary } from '../../features/cart'

export function CartPage() {
    return (
        <PageWrapper description="Cart page scaffold for line items and order summary." title="Cart">
            <CartSummary />
        </PageWrapper>
    )
}