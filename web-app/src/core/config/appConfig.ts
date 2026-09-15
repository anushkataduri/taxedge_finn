import { env } from './environment'

export const appConfig = {
  name: env.appName,
  supportEmail: 'support@taxedge.in',
  defaultLocale: 'en-IN',
  currency: 'INR',
  dateFormat: 'dd MMM yyyy',
} as const
