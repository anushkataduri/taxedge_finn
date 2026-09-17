import type { ApplicationStatus, Timestamped } from '@shared/types'

/** Replace with the real Applications model once the API contract is agreed. */
export interface ApplicationsItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface ApplicationsFilters {
  status?: ApplicationStatus
  search?: string
}
