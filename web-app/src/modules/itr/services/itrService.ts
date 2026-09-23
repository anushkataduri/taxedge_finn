import { env } from '@core/config'

import { itrApi } from '../api/itrApi'
import type { ItrFilters, ItrItem } from '../types/itr.types'

/* Development mock - delete once the API is live. */
const mockItems: ItrItem[] = [
  {
    id: 'itr_001',
    reference: 'TE-Itr-0001',
    title: 'Sample filing',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const itrService = {
  async list(filters?: ItrFilters): Promise<ItrItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await itrApi.list(filters)
    return response.data
  },
}
