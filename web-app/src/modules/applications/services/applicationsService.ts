import { env } from '@core/config'

import { applicationsApi } from '../api/applicationsApi'
import type { ApplicationsFilters, ApplicationsItem } from '../types/applications.types'

/* Development mock - delete once the API is live. */
const mockItems: ApplicationsItem[] = [
  {
    id: 'applications_001',
    reference: 'TE-Applications-0001',
    title: 'Sample application',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const applicationsService = {
  async list(filters?: ApplicationsFilters): Promise<ApplicationsItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await applicationsApi.list(filters)
    return response.data
  },
}
