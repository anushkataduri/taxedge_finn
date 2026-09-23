import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { ItrFilters, ItrItem } from '../types/itr.types'

export const itrApi = {
  list: (filters?: ItrFilters) =>
    apiClient.get<ApiListResponse<ItrItem>>(apiEndpoints.itr.list, { params: filters }),
}
