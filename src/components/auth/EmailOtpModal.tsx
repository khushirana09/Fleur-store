import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, ArrowRight, Loader } from 'lucide-react'
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface EmailOtpModalProps {
    open: boolean
    onClose: () => void
    onSuccess: (email: string) => void
}

export function EmailOtpModal({ open, onClose, onSuccess }: EmailOtpModalProps) {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSendLink() {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }

        setLoading(true)
        try {
            const actionCodeSettings = {
                url: `${import.meta.env.VITE_APP_URL}/auth/verify`,
                handleCodeInApp: true,
            }

            await sendSignInLinkToEmail(auth, email, actionCodeSettings)

            // Save email locally to complete sign in after clicking link
            window.localStorage.setItem('fleur_otp_email', email)

            setSent(true)
            toast.success('Magic link sent! Check your inbox 📧')
        } catch (error) {
            console.error(error)
            toast.error('Failed to send link. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    function handleClose() {
        setEmail('')
        setSent(false)
        onClose()
    }

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
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-mauve-400 hover:text-mauve-700"
                        >
                            <X size={18} />
                        </button>

                        {!sent ? (
                            /* ── Enter email screen ── */
                            <div className="space-y-6">
                                <div>
                                    <div className="text-3xl mb-3">📧</div>
                                    <h2 className="font-serif text-2xl text-mauve-900">
                                        Sign in with Email
                                    </h2>
                                    <p className="text-sm text-mauve-400 mt-1.5">
                                        We'll send a magic link to your inbox — no password needed.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border border-rose-100 rounded-xl
                                  px-4 py-3 focus-within:border-rose-300 transition-colors">
                                        <Mail size={15} className="text-rose-300 flex-shrink-0" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendLink()}
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
                                        onClick={handleSendLink}
                                        isLoading={loading}
                                        rightIcon={!loading ? <ArrowRight size={16} /> : undefined}
                                    >
                                        {loading ? 'Sending…' : 'Send Magic Link'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* ── Link sent screen ── */
                            <div className="space-y-6 text-center">
                                <div>
                                    <div className="text-5xl mb-4">📬</div>
                                    <h2 className="font-serif text-2xl text-mauve-900">
                                        Check your inbox!
                                    </h2>
                                    <p className="text-sm text-mauve-400 mt-2 leading-relaxed">
                                        We sent a magic link to{' '}
                                        <span className="text-rose-500 font-medium">{email}</span>.
                                        Click the link in the email to sign in.
                                    </p>
                                </div>

                                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-left space-y-2">
                                    {['Check your spam folder if you don\'t see it',
                                        'Link expires in 10 minutes',
                                        'You\'ll be signed in automatically after clicking'
                                    ].map((tip) => (
                                        <p key={tip} className="text-[11px] text-mauve-500 flex items-start gap-2">
                                            <span className="text-rose-400 mt-0.5">✦</span> {tip}
                                        </p>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setSent(false)}
                                    className="text-[12px] text-rose-400 hover:text-rose-600 transition-colors"
                                >
                                    Use a different email
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}