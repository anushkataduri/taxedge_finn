import { useAsync } from '@shared/hooks'

import { documentsService } from '../services/documentsService'
import type { DocumentsItem } from '../types/documents.types'

export const useDocuments = () => useAsync<DocumentsItem[]>(() => documentsService.list(), [])
