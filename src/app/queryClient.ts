import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes after component unmounts
      gcTime: 10 * 60 * 1000,
      // Retry failed requests twice before showing error
      retry: 2,
      // Don't refetch when window regains focus in development
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      retry: 0,
    },
  },
})