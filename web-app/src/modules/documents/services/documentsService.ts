import { env } from '@core/config'

import { documentsApi } from '../api/documentsApi'
import type { DocumentsFilters, DocumentsItem } from '../types/documents.types'

/* Development mock - delete once the API is live. */
const mockItems: DocumentsItem[] = [
  {
    id: 'documents_001',
    reference: 'TE-Documents-0001',
    title: 'Sample document',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const documentsService = {
  async list(filters?: DocumentsFilters): Promise<DocumentsItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await documentsApi.list(filters)
    return response.data
  },
}
