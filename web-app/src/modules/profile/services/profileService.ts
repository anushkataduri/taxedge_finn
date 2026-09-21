import { apiClient, apiEndpoints } from '@core/api'
import { env } from '@core/config'

import { profileApi } from '../api/profileApi'
import type { ProfileFilters, ProfileItem } from '../types/profile.types'

/* Development mock - delete once the API is live. */
const mockItems: ProfileItem[] = [
  {
    id: 'profile_001',
    reference: 'TE-Profile-0001',
    title: 'Sample profile record',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const profileService = {
  async list(filters?: ProfileFilters): Promise<ProfileItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await profileApi.list(filters)
    return response.data
  },

  async createProfile(values: Record<string, unknown>): Promise<void> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return
    }
    await apiClient.post(apiEndpoints.auth.profile, values)
  },
}

