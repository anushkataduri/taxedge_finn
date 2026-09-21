import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { ApplicationsFilters, ApplicationsItem } from '../types/applications.types'

export const applicationsApi = {
  list: (filters?: ApplicationsFilters) =>
    apiClient.get<ApiListResponse<ApplicationsItem>>(apiEndpoints.applications.list, { params: filters }),
}
