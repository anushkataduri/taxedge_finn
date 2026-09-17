import type { ApplicationStatus, Timestamped } from '@shared/types'

/** Replace with the real Profile model once the API contract is agreed. */
export interface ProfileItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface ProfileFilters {
  status?: ApplicationStatus
  search?: string
}

export interface UserProfileData {
  id: string
  fullName: string
  email: string
  dob: string
  pan: string
  aadhaar: string
  mobile?: string
  address: string
  isProfileComplete: boolean
  createdAt: string
  updatedAt: string
}
