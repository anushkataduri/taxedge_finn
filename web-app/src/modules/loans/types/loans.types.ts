import type { ApplicationStatus, Timestamped } from '@shared/types'

/** Replace with the real Loans model once the API contract is agreed. */
export interface LoansItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface LoansFilters {
  status?: ApplicationStatus
  search?: string
}
