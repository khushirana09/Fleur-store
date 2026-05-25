import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { store } from '@/app/store'
import { queryClient } from '@/app/queryClient'
import { router } from '@/routes/router'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#4D2030',
                border: '1px solid #F5CECC',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(196,123,142,0.12)',
              },
              success: {
                iconTheme: { primary: '#C47B8E', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#E8A598', secondary: '#ffffff' },
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)