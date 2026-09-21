/**
 * Typed access to Vite environment variables.
 * Never read import.meta.env anywhere else in the app.
 */
const required = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'TaxEdge',
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export type Env = typeof env
