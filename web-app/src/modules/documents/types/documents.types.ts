import type { ApplicationStatus, Timestamped } from '@shared/types'

/** Replace with the real Documents model once the API contract is agreed. */
export interface DocumentsItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface DocumentsFilters {
  status?: ApplicationStatus
  search?: string
}
