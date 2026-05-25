import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

export function AuthForm() {
    return (
        <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Input placeholder="Email address" type="email" />
            <Input placeholder="Password" type="password" />
            <Button className="w-full">Continue</Button>
        </form>
    )
}