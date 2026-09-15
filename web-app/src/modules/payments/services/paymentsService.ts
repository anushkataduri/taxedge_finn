import { env } from '@core/config'

import { paymentsApi } from '../api/paymentsApi'
import type { PaymentsFilters, PaymentsItem } from '../types/payments.types'

/* Development mock - delete once the API is live. */
const mockItems: PaymentsItem[] = [
  {
    id: 'payments_001',
    reference: 'TE-Payments-0001',
    title: 'Sample payment',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const paymentsService = {
  async list(filters?: PaymentsFilters): Promise<PaymentsItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await paymentsApi.list(filters)
    return response.data
  },
}
