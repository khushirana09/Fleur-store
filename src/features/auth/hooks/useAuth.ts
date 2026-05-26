import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setCredentials, setLoading, logout, updateUser } from '@/features/auth/authSlice'
import { auth, googleProvider } from '@/lib/firebase/firebase'
import { signInWithPopup } from 'firebase/auth'
import type { LoginFormData } from '@/lib/utils/validators'
import type { User } from '@/types/auth.types'

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export function useAuth() {
  const auth_state = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const login = useCallback(async (data: LoginFormData) => {
    dispatch(setLoading(true))
    try {
      const mockUser: User = {
        id: '1',
        email: data.email,
        firstName: data.email.split('@')[0],
        lastName: 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
        welcomeMessage: 'Welcome to Fleur! Use code FLEUR10 for 10% off your first order.'
      } as User
      dispatch(setCredentials({
        user: mockUser,
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      }))
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // ── NEW: Google login ──
  const loginWithGoogle = useCallback(async () => {
    dispatch(setLoading(true))
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      const nameParts = (firebaseUser.displayName ?? 'Fleur User').split(' ')
      const googleUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        firstName: nameParts[0] ?? 'Fleur',
        lastName: nameParts.slice(1).join(' ') || 'User',
        avatar: firebaseUser.photoURL ?? undefined,
        role: 'user',
        createdAt: new Date().toISOString(),
      }

      dispatch(setCredentials({
        user: googleUser,
        token: await firebaseUser.getIdToken(),
        refreshToken: firebaseUser.refreshToken,
      }))
    } catch (error) {
      console.error('Google login failed:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const register = useCallback(async (data: RegisterFormData) => {
    dispatch(setLoading(true))
    try {
      const mockUser: User = {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      dispatch(setCredentials({
        user: mockUser,
        token: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      }))
    } catch (error) {
      console.error('Register failed:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const logoutUser = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const updateProfile = useCallback(async (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }) => {
    dispatch(setLoading(true))
    try {
      dispatch(updateUser(data))
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  return {
    isAuthenticated: auth_state.isAuthenticated,
    user: auth_state.user,
    isLoading: auth_state.isLoading,
    login,
    loginWithGoogle,
    register,
    updateProfile,
    logout: logoutUser,
  }
}