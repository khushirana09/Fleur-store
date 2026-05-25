import { Button } from '../../../components/ui/Button'
import { useCart } from '../hooks/useCart'

export function CartSummary() {
    const { clear, summary } = useCart()

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Cart Summary</h2>
            <p className="mt-2 text-sm text-slate-600">Items in cart: {summary.itemCount}</p>
            <Button className="mt-4" onClick={clear}>
                Clear cart
            </Button>
        </section>
    )
}