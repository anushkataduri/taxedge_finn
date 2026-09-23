import type { ApplicationStatus, Timestamped } from '@shared/types'

/** Replace with the real Chat model once the API contract is agreed. */
export interface ChatItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface ChatFilters {
  status?: ApplicationStatus
  search?: string
}
