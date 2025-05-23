import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import App from './App.tsx'
import posthog from 'posthog-js'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

// Initialize PostHog with a default configuration
// This should be replaced with your actual PostHog key from environment
// variables in a production environment
posthog.init(
  import.meta.env.VITE_POSTHOG_KEY,
  {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    // Load the PostHog library in development mode based on environment
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        // Don't track in development
        posthog.opt_out_capturing()
      }
    }
  }
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    </QueryClientProvider>
  </StrictMode>,
)
