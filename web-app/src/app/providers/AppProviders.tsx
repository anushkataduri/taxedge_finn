import type { ReactNode } from 'react'

import { ErrorBoundary } from '@core/errors'

import { ThemeProvider } from './ThemeProvider'
import { ToastHost } from './ToastHost'

/** Every cross-cutting provider, composed once. */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <ThemeProvider>
      {children}
      <ToastHost />
    </ThemeProvider>
  </ErrorBoundary>
)
