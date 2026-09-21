import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type { ChatFilters, ChatItem } from '../types/chat.types'

export const chatApi = {
  list: (filters?: ChatFilters) =>
    apiClient.get<ApiListResponse<ChatItem>>(apiEndpoints.chat.threads, { params: filters }),
}
