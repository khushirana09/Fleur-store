import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useState, useMemo } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { registerSchema, type RegisterFormData } from '@/lib/utils/validators'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils/cn'

interface StrengthResult { score: number; label: string; color: string }

function getPasswordStrength(password: string): StrengthResult {
    if (!password) return { score: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const levels = [
        { label: 'Very weak', color: 'bg-red-400' },
        { label: 'Weak', color: 'bg-orange-400' },
        { label: 'Fair', color: 'bg-amber-400' },
        { label: 'Strong', color: 'bg-rose-400' },
        { label: 'Very strong', color: 'bg-green-400' },
    ]
    return { score, ...levels[Math.min(score, 4)] }
}


const { register: registerUser, loginWithGoogle, isLoading } = useAuth()
const navigate = useNavigate()
const [showPass, setShowPass] = useState(false)
const [showConfirm, setShowConfirm] = useState(false)
const [passwordVal, setPasswordVal] = useState('')

const strength = useMemo(() => getPasswordStrength(passwordVal), [passwordVal])

const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
} = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

const watchedPassword = watch('password', '')

async function onSubmit(data: RegisterFormData) {
    await registerUser(data)
    navigate('/')
}

async function handleGoogleRegister() {
    await loginWithGoogle()
    navigate('/')
}

return (
    <PageWrapper
        title="Create Account"
        description="Join Fleur and discover Indian women's fashion — kurtas, dresses, sarees & more."
    >
        <div className="min-h-[calc(100vh-64px)] flex">

            {/* ── Left: decorative ── */}
            <div className="hidden lg:flex flex-1 items-center justify-center
                        bg-gradient-to-br from-rose-50 to-cream-100 relative overflow-hidden">
                {[
                    { top: '5%', left: '8%', size: 110, opacity: 0.14, delay: 0 },
                    { top: '72%', left: '4%', size: 75, opacity: 0.09, delay: 1 },
                    { top: '12%', right: '6%', size: 140, opacity: 0.11, delay: 0.5 },
                    { top: '68%', right: '8%', size: 95, opacity: 0.10, delay: 2 },
                ].map((p, i) => (
                    <motion.div
                        key={i}
                        animate={{ rotate: [0, 12, 0], y: [0, -10, 0] }}
                        transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
                        className="absolute text-rose-200 select-none pointer-events-none"
                        style={{
                            top: p.top, left: (p as any).left, right: (p as any).right,
                            fontSize: p.size, opacity: p.opacity, lineHeight: 1,
                        }}
                    >
                        🌸
                    </motion.div>
                ))}

                <div className="relative z-10 text-center space-y-6 max-w-xs px-8">
                    <div className="text-6xl">💐</div>
                    <h2 className="font-serif text-3xl font-normal text-mauve-900 leading-snug">
                        Join 50,000+
                        <br />Indian women
                        <br />who love Fleur.
                    </h2>
                    <p className="text-mauve-500 text-sm leading-relaxed">
                        Get early access to new drops, exclusive member deals,
                        and a wardrobe curated just for you.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                            ['50K+', 'Happy customers'],
                            ['200+', 'New styles weekly'],
                            ['4.8★', 'Average rating'],
                            ['Free', 'Returns under 7 days'],
                        ].map(([val, label]) => (
                            <div key={label}
                                className="bg-white/70 border border-rose-100 rounded-xl p-3 text-left">
                                <p className="font-serif text-xl text-rose-500">{val}</p>
                                <p className="text-[10px] text-mauve-500 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right: form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-cream-50 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm space-y-6"
                >
                    {/* Logo */}
                    <div>
                        <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-6">
                            <span className="text-2xl">🌸</span>
                            <span className="font-serif text-2xl text-rose-700 font-normal tracking-wide">
                                Fleur
                            </span>
                        </Link>
                        <h1 className="font-serif text-3xl font-normal text-mauve-900">
                            Create your account
                        </h1>
                        <p className="text-mauve-400 text-sm mt-1.5">
                            Already have an account?{' '}
                            <Link to={ROUTES.LOGIN}
                                className="text-rose-500 hover:text-rose-700 transition-colors font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="First Name"
                                autoComplete="given-name"
                                placeholder="Priya"
                                leftIcon={<User size={14} className="text-rose-300" />}
                                error={errors.firstName?.message}
                                required
                                {...register('firstName')}
                            />
                            <Input
                                label="Last Name"
                                autoComplete="family-name"
                                placeholder="Sharma"
                                error={errors.lastName?.message}
                                required
                                {...register('lastName')}
                            />
                        </div>

                        {/* Email */}
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

                        {/* Password */}
                        <div className="space-y-2">
                            <Input
                                label="Password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Min. 8 characters"
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
                                {...register('password', {
                                    onChange: (e) => setPasswordVal(e.target.value),
                                })}
                            />

                            {/* Strength meter */}
                            {watchedPassword && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-1.5"
                                >
                                    <div className="flex gap-1">
                                        {Array.from({ length: 4 }, (_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    'h-1 flex-1 rounded-full transition-all duration-300',
                                                    i < strength.score ? strength.color : 'bg-rose-100'
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {strength.label && (
                                        <p className="text-[11px] text-mauve-400">
                                            Strength:{' '}
                                            <span className={cn(
                                                strength.score <= 1 ? 'text-red-500' :
                                                    strength.score <= 2 ? 'text-amber-500' :
                                                        'text-rose-500'
                                            )}>
                                                {strength.label}
                                            </span>
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <Input
                            label="Confirm Password"
                            type={showConfirm ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Repeat password"
                            leftIcon={<Lock size={15} className="text-rose-300" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                    className="text-mauve-400 hover:text-mauve-700 transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            }
                            error={errors.confirmPassword?.message}
                            required
                            {...register('confirmPassword')}
                        />

                        {/* Terms */}
                        <p className="text-[11px] text-mauve-400 leading-relaxed">
                            By creating an account you agree to our{' '}
                            <a href="#" className="text-rose-500 hover:text-rose-700 transition-colors">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-rose-500 hover:text-rose-700 transition-colors">
                                Privacy Policy
                            </a>.
                        </p>

                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                            {isLoading ? 'Creating account…' : 'Create Account 🌸'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 h-px bg-rose-100" />
                        <span className="text-[11px] tracking-widest uppercase text-mauve-400">or</span>
                        <div className="flex-1 h-px bg-rose-100" />
                    </div>

                    {/* Social */}
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleGoogleRegister}
                        leftIcon={<span className="font-semibold text-sm w-5 text-center">G</span>}
                    >
                        Continue with Google
                    </Button>
                </motion.div>
            </div>

        </div>
    </PageWrapper>
)
}