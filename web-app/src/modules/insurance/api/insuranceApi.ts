import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { InsuranceFilters, InsuranceItem } from '../types/insurance.types'

export const insuranceApi = {
  list: (filters?: InsuranceFilters) =>
    apiClient.get<ApiListResponse<InsuranceItem>>(apiEndpoints.insurance.list, { params: filters }),
}
