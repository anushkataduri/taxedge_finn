import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { DocumentsFilters, DocumentsItem } from '../types/documents.types'

export const documentsApi = {
  list: (filters?: DocumentsFilters) =>
    apiClient.get<ApiListResponse<DocumentsItem>>(apiEndpoints.documents.list, { params: filters }),
}
