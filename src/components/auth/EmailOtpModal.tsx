import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, ArrowRight, RefreshCw } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface EmailOtpModalProps {
    open: boolean
    onClose: () => void
    onVerified: (email: string) => void
}

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export function EmailOtpModal({ open, onClose, onVerified }: EmailOtpModalProps) {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [otpInput, setOtpInput] = useState('')
    const [generatedOtp, setGeneratedOtp] = useState('')
    const [otpExpiry, setOtpExpiry] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)

    function startResendTimer() {
        setResendTimer(30)
        const interval = setInterval(() => {
            setResendTimer((t) => {
                if (t <= 1) { clearInterval(interval); return 0 }
                return t - 1
            })
        }, 1000)
    }

    async function handleSendOTP() {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }

        setLoading(true)
        try {
            const otp = generateOTP()
            const expiry = Date.now() + 10 * 60 * 1000 // 10 minutes

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    to_name: email.split('@')[0],
                    otp: otp,
                    name: "Fleur", // or your brand name, or leave blank if not needed
                    email: email    // for Reply To
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )

            setGeneratedOtp(otp)
            setOtpExpiry(expiry)
            setStep('otp')
            startResendTimer()
            toast.success('OTP sent to your email! 📧')
        } catch (error) {
            console.error(error)
            toast.error('Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    async function handleVerifyOTP() {
        if (otpInput.length !== 6) {
            toast.error('Please enter the 6-digit OTP')
            return
        }

        if (Date.now() > otpExpiry) {
            toast.error('OTP has expired. Please request a new one.')
            setStep('email')
            setOtpInput('')
            return
        }

        if (otpInput !== generatedOtp) {
            toast.error('Incorrect OTP. Please try again.')
            setOtpInput('')
            return
        }

        toast.success('Email verified! Welcome to Fleur 🌸')
        onVerified(email)
        handleClose()
    }

    async function handleResend() {
        if (resendTimer > 0) return
        setOtpInput('')
        await handleSendOTP()
    }

    function handleClose() {
        setStep('email')
        setEmail('')
        setOtpInput('')
        setGeneratedOtp('')
        onClose()
    }

    // Remaining time display
    const remainingMinutes = Math.max(0, Math.ceil((otpExpiry - Date.now()) / 60000))

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[90vw] max-w-sm bg-white rounded-3xl p-8 z-50 shadow-xl"
                    >
                        {/* Close */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-mauve-400 hover:text-mauve-700"
                        >
                            <X size={18} />
                        </button>

                        <AnimatePresence mode="wait">

                            {/* ── Step 1: Enter Email ── */}
                            {step === 'email' && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <div className="text-3xl mb-3">📧</div>
                                        <h2 className="font-serif text-2xl text-mauve-900">
                                            Sign in with Email
                                        </h2>
                                        <p className="text-sm text-mauve-400 mt-1.5">
                                            We'll send a 6-digit OTP to your email. Expires in 10 minutes.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 border border-rose-100
                                    rounded-xl px-4 py-3 focus-within:border-rose-300
                                    transition-colors">
                                            <Mail size={15} className="text-rose-300 flex-shrink-0" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                                placeholder="you@example.com"
                                                className="flex-1 text-sm text-mauve-900 placeholder:text-mauve-300
                                   focus:outline-none bg-transparent"
                                                style={{ fontSize: '16px' }}
                                                autoFocus
                                            />
                                        </div>

                                        <Button
                                            fullWidth
                                            size="lg"
                                            onClick={handleSendOTP}
                                            isLoading={loading}
                                            rightIcon={!loading ? <ArrowRight size={16} /> : undefined}
                                        >
                                            {loading ? 'Sending OTP…' : 'Send OTP'}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 2: Enter OTP ── */}
                            {step === 'otp' && (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <div className="text-3xl mb-3">🔐</div>
                                        <h2 className="font-serif text-2xl text-mauve-900">
                                            Enter OTP
                                        </h2>
                                        <p className="text-sm text-mauve-400 mt-1.5">
                                            We sent a 6-digit code to{' '}
                                            <span className="text-rose-500 font-medium">{email}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {/* OTP input */}
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                                            onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                                            placeholder="000000"
                                            className="w-full text-center text-3xl font-mono tracking-[0.5em]
                                 border border-rose-100 rounded-xl px-4 py-4
                                 focus:outline-none focus:border-rose-300
                                 text-mauve-900 placeholder:text-mauve-200"
                                            style={{ fontSize: '28px' }}
                                            autoFocus
                                        />

                                        {/* Expiry notice */}
                                        <p className="text-center text-[11px] text-mauve-400">
                                            {remainingMinutes > 0
                                                ? `Code expires in ~${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`
                                                : 'Code has expired — please request a new one'}
                                        </p>

                                        <Button
                                            fullWidth
                                            size="lg"
                                            onClick={handleVerifyOTP}
                                        >
                                            Verify OTP
                                        </Button>

                                        {/* Resend */}
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={handleResend}
                                                disabled={resendTimer > 0}
                                                className="flex items-center gap-1.5 text-[12px] text-rose-400
                                   hover:text-rose-600 disabled:text-mauve-300
                                   disabled:cursor-not-allowed transition-colors"
                                            >
                                                <RefreshCw size={12} />
                                                {resendTimer > 0
                                                    ? `Resend in ${resendTimer}s`
                                                    : 'Resend OTP'}
                                            </button>
                                            <span className="text-mauve-300 text-xs">·</span>
                                            <button
                                                onClick={() => { setStep('email'); setOtpInput('') }}
                                                className="text-[12px] text-mauve-400 hover:text-mauve-600 transition-colors"
                                            >
                                                Change email
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}