import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { EmailOtpModal } from '@/components/auth/EmailOtpModal'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import toast from 'react-hot-toast'
import { loginSchema, type LoginFormData } from '@/lib/utils/validators'
import { ROUTES } from '@/lib/constants/routes'

export function Login() {
    const { login, loginWithGoogle, isLoading } = useAuth()
    const [showPass, setShowPass] = useState(false)
    const [otpModalOpen, setOtpModalOpen] = useState(false)


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(data: LoginFormData) {
        await login(data)
    }

    function fillDemo() {
        setValue('email', 'demo@fleur.in')
        setValue('password', 'Demo1234')
    }

    return (
        <PageWrapper title="Sign In" description="Sign in to your Fleur account and shop the latest women's fashion.">
            <div className="min-h-[calc(100vh-64px)] flex">

                {/* ── Left: form ── */}
                <div className="flex-1 flex items-center justify-center px-6 py-16 bg-cream-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-sm space-y-7"
                    >
                        {/* Social */}
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={loginWithGoogle}
                            leftIcon={<span className="font-semibold text-sm w-5 text-center">G</span>}
                        >
                            Continue with Google
                        </Button>

                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setOtpModalOpen(true)}
                            leftIcon={<span className="text-sm w-5 text-center">📧</span>}
                        >
                            Continue with Email OTP
                        </Button>
                        {/* Email OTP Modal */}
                        <EmailOtpModal
                            open={otpModalOpen}
                            onClose={() => setOtpModalOpen(false)}
                            onSuccess={(email) => {
                                setOtpModalOpen(false)
                            }}
                        />

                        {/* Demo hint */}
                        <div className="flex items-center justify-between bg-white border border-rose-100
                            rounded-2xl px-4 py-3">
                            <div>
                                <p className="text-[11px] tracking-[0.06em] uppercase text-mauve-400 mb-0.5">
                                    Demo account
                                </p>
                                <p className="text-xs text-mauve-500">demo@fleur.in · Demo1234</p>
                            </div>
                            <Button variant="secondary" size="sm" onClick={fillDemo}>
                                Fill
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                            <Input
                                label="Email Address"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                leftIcon={<Mail size={15} className="text-rose-300" />}
                                error={errors.email?.message}
                                required
                                {...register('email')}
                            />
                            <Input
                                label="Password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                leftIcon={<Lock size={15} className="text-rose-300" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        aria-label={showPass ? 'Hide password' : 'Show password'}
                                        className="text-mauve-400 hover:text-mauve-700 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                }
                                error={errors.password?.message}
                                required
                                {...register('password')}
                            />

                            <div className="flex justify-end">
                                <a href="#"
                                    className="text-[12px] text-rose-500 hover:text-rose-700 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                                {isLoading ? 'Signing in…' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3">
                            <div className="flex-1 h-px bg-rose-100" />
                            <span className="text-[11px] tracking-widest uppercase text-mauve-400">or</span>
                            <div className="flex-1 h-px bg-rose-100" />
                        </div>

                        {/* Social */}
                        {[
                            { label: 'Continue with Google', icon: 'G' },
                            { label: 'Continue with Apple', icon: '⌘' },
                        ].map(({ label, icon }) => (
                            <Button
                                key={label}
                                variant="secondary"
                                fullWidth
                                onClick={() => { }}
                                leftIcon={<span className="font-semibold text-sm w-5 text-center">{icon}</span>}
                            >
                                {label}
                            </Button>
                        ))}

                        {/* Register link */}
                        <p className="text-center text-sm text-mauve-400">
                            New to Fleur?{' '}
                            <Link to={ROUTES.REGISTER}
                                className="text-rose-500 hover:text-rose-700 transition-colors font-medium">
                                Create account
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* ── Right: decorative panel ── */}
                <div className="hidden lg:flex flex-1 items-center justify-center
                        bg-gradient-to-br from-rose-50 to-cream-100 relative overflow-hidden">
                    {/* Background petals */}
                    {[
                        { top: '8%', left: '10%', size: 100, opacity: 0.15, delay: 0 },
                        { top: '70%', left: '5%', size: 70, opacity: 0.10, delay: 1 },
                        { top: '15%', right: '8%', size: 130, opacity: 0.12, delay: 0.5 },
                        { top: '65%', right: '10%', size: 90, opacity: 0.10, delay: 1.5 },
                    ].map((p, i) => (
                        <motion.div
                            key={i}
                            animate={{ rotate: [0, 10, 0], y: [0, -8, 0] }}
                            transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
                            className="absolute text-rose-300 select-none pointer-events-none"
                            style={{
                                top: p.top, left: (p as any).left, right: (p as any).right,
                                fontSize: p.size, opacity: p.opacity, lineHeight: 1,
                            }}
                        >
                            🌸
                        </motion.div>
                    ))}

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-6 max-w-xs px-8">
                        <div className="text-6xl">🌸</div>
                        <h2 className="font-serif text-3xl font-normal text-mauve-900 leading-snug">
                            Your wardrobe,
                            <br />your rules.
                        </h2>
                        <p className="text-mauve-500 text-sm leading-relaxed">
                            Shop kurtas, sarees, dresses and more — all curated for Indian women
                            who love fashion that feels like them.
                        </p>

                        {/* Feature list */}
                        <ul className="space-y-3 text-left mt-4">
                            {[
                                '🚚 Free delivery above ₹999',
                                '↩ Easy 7-day returns',
                                '🌸 Exclusive member deals',
                                '💳 UPI, cards & COD accepted',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2.5 text-sm text-mauve-500">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </PageWrapper>
    )
}