export type Nullable<T> = T | null
export type Maybe<T> = T | null | undefined
export type Dict<T = unknown> = Record<string, T>

/**
 * Backend enum values, used verbatim on the frontend.
 * Display labels live in shared/constants/common.constants.ts.
 */
export const APPLICATION_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'MANAGER_REVIEW',
  'QUERY_RAISED',
  'QUERY_RESOLVED',
  'READY_FOR_ASSIGNMENT',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const PAYMENT_STATUSES = ['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const SERVICE_TYPES = ['GST', 'ITR', 'LOAN', 'INSURANCE', 'REGISTRATION', 'ACCOUNTS'] as const
export type ServiceType = (typeof SERVICE_TYPES)[number]

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface SelectOption<T extends string = string> {
  label: string
  value: T
  disabled?: boolean
}

export interface Money {
  amount: number
  currency: string
}

export interface Timestamped {
  createdAt: string
  updatedAt: string
}
