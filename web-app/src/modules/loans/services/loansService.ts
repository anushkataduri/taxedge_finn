import { env } from '@core/config'

import { loansApi } from '../api/loansApi'
import type { LoansFilters, LoansItem } from '../types/loans.types'

/* Development mock - delete once the API is live. */
const mockItems: LoansItem[] = [
  {
    id: 'loans_001',
    reference: 'TE-Loans-0001',
    title: 'Sample loan application',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const loansService = {
  async list(filters?: LoansFilters): Promise<LoansItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await loansApi.list(filters)
    return response.data
  },
}
