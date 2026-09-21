import { env } from '@core/config'

import { insuranceApi } from '../api/insuranceApi'
import type { InsuranceFilters, InsuranceItem } from '../types/insurance.types'

/* Development mock - delete once the API is live. */
const mockItems: InsuranceItem[] = [
  {
    id: 'insurance_001',
    reference: 'TE-Insurance-0001',
    title: 'Sample policy',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const insuranceService = {
  async list(filters?: InsuranceFilters): Promise<InsuranceItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await insuranceApi.list(filters)
    return response.data
  },
}
