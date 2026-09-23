import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { ProfileFilters, ProfileItem } from '../types/profile.types'

export const profileApi = {
  list: (filters?: ProfileFilters) =>
    apiClient.get<ApiListResponse<ProfileItem>>(apiEndpoints.profile.me, { params: filters }),
}
