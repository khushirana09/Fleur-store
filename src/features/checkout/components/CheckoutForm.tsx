import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

export function CheckoutForm() {
    return (
        <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Input placeholder="Full name" />
            <Input placeholder="Shipping address" />
            <Button className="w-full">Place order</Button>
        </form>
    )
}