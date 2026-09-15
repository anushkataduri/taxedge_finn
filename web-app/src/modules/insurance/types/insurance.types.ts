import type { ApplicationStatus, Timestamped } from '@shared/types'

/** Replace with the real Insurance model once the API contract is agreed. */
export interface InsuranceItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface InsuranceFilters {
  status?: ApplicationStatus
  search?: string
}
