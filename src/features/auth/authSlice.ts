import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/types/auth.types'

function loadInitialState(): AuthState {
  try {
    const user  = localStorage.getItem('fleur_user')
    const token = localStorage.getItem('fleur_token')
    return {
      user:            user  ? (JSON.parse(user) as User) : null,
      token:           token ?? null,
      refreshToken:    localStorage.getItem('fleur_refresh_token'),
      isAuthenticated: !!token,
      isLoading:       false,
    }
  } catch {
    return {
      user: null, token: null, refreshToken: null,
      isAuthenticated: false, isLoading: false,
    }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    /**
     * Call after a successful login or register.
     * Persists token + user to localStorage automatically.
     */
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) {
      const { user, token, refreshToken } = action.payload
      state.user            = user
      state.token           = token
      state.refreshToken    = refreshToken
      state.isAuthenticated = true
      state.isLoading       = false

      localStorage.setItem('fleur_user',          JSON.stringify(user))
      localStorage.setItem('fleur_token',         token)
      localStorage.setItem('fleur_refresh_token', refreshToken)
    },

    /**
     * Clears all auth state and removes from localStorage.
     */
    logout(state) {
      state.user            = null
      state.token           = null
      state.refreshToken    = null
      state.isAuthenticated = false
      state.isLoading       = false

      localStorage.removeItem('fleur_user')
      localStorage.removeItem('fleur_token')
      localStorage.removeItem('fleur_refresh_token')
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },

    /** Update user profile fields without changing token */
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('fleur_user', JSON.stringify(state.user))
      }
    },
  },
})

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions
export default authSlice.reducer