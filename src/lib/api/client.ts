import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { APP_CONFIG } from '@/lib/constants/config'
import type { ApiError } from '@/types/order.types'

export const apiClient = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/* ── Request interceptor: attach JWT token ── */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('fleur_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

/* ── Response interceptor: normalise errors ── */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Auto-logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('fleur_token')
      localStorage.removeItem('fleur_user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error.response?.data ?? error)
  }
)