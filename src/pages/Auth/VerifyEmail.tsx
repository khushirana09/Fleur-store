import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { auth } from '@/lib/firebase/firebase'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from '@/features/auth/authSlice'
import { ROUTES } from '@/lib/constants/routes'
import type { User } from '@/types/auth.types'

export function VerifyEmail() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

    useEffect(() => {
        async function verify() {
            if (!isSignInWithEmailLink(auth, window.location.href)) {
                setStatus('error')
                return
            }

            let email = window.localStorage.getItem('fleur_otp_email')

            if (!email) {
                // If opened on different device, ask for email
                email = window.prompt('Please enter your email to confirm sign in') ?? ''
            }

            if (!email) {
                setStatus('error')
                return
            }

            try {
                const result = await signInWithEmailLink(auth, email, window.location.href)
                window.localStorage.removeItem('fleur_otp_email')

                const firebaseUser = result.user
                const nameParts = (firebaseUser.displayName ?? email.split('@')[0]).split(' ')

                const user: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email ?? email,
                    firstName: nameParts[0] ?? 'Fleur',
                    lastName: nameParts.slice(1).join(' ') || 'User',
                    avatar: firebaseUser.photoURL ?? undefined,
                    role: 'user',
                    createdAt: new Date().toISOString(),
                }

                dispatch(setCredentials({
                    user,
                    token: await firebaseUser.getIdToken(),
                    refreshToken: firebaseUser.refreshToken,
                }))

                setStatus('success')
                setTimeout(() => navigate(ROUTES.HOME), 1500)
            } catch (error) {
                console.error(error)
                setStatus('error')
            }
        }

        verify()
    }, [dispatch, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
            <div className="text-center space-y-4">
                {status === 'verifying' && (
                    <>
                        <div className="text-5xl animate-pulse">🌸</div>
                        <p className="text-mauve-500 text-sm">Verifying your link…</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="text-5xl">✅</div>
                        <p className="text-mauve-500 text-sm">Signed in! Redirecting…</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="text-5xl">❌</div>
                        <p className="text-mauve-500 text-sm">Invalid or expired link.</p>
                        <button
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="text-rose-500 text-sm underline"
                        >
                            Back to login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}