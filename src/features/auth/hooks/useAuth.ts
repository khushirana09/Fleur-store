import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { setCredentials, setLoading, logout, updateUser } from '@/features/auth/authSlice'
import type { LoginFormData } from '@/lib/utils/validators'
import type { User } from '@/types/auth.types'

export interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  } | null
  isLoading: boolean
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export function useAuth() {
  const auth = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  
  const login = useCallback(async (data: LoginFormData) => {
    dispatch(setLoading(true))
    try {
      // Simulate API call - replace with actual API endpoint
      const mockUser: User = {
        id: '1',
        email: data.email,
        firstName: data.email.split('@')[0],
        lastName: 'User',
        role: 'user',
        createdAt: new Date().toISOString(),
        // Add a welcome message and promo for Fleur
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

  const register = useCallback(async (data: RegisterFormData) => {
    dispatch(setLoading(true))
    try {
      // Simulate API call - replace with actual API endpoint
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
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isLoading: auth.isLoading,
    login,
    register,
    updateProfile,
    logout: logoutUser,
  }
}