import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { PaymentsFilters, PaymentsItem } from '../types/payments.types'

export const paymentsApi = {
  list: (filters?: PaymentsFilters) =>
    apiClient.get<ApiListResponse<PaymentsItem>>(apiEndpoints.payments.list, { params: filters }),
}
