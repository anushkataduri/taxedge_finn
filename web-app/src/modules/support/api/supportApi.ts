import { apiClient, apiEndpoints } from '@core/api'
import type { ApiListResponse } from '@shared/types'

import type {
  SendMessagePayload,
  SupportConversation,
  SupportExecutive,
  SupportFilters,
  SupportItem,
  SupportMessage,
} from '../types/support.types'

export const supportApi = {
  list: (filters?: SupportFilters) =>
    apiClient.get<ApiListResponse<SupportItem>>(apiEndpoints.support.tickets, { params: filters }),

  getExecutives: () =>
    apiClient.get<SupportExecutive[]>(apiEndpoints.support.executives),

  getConversation: (appId: string) =>
    apiClient.get<SupportConversation>(apiEndpoints.support.conversation(appId)),

  sendMessage: (payload: SendMessagePayload) =>
    apiClient.post<SupportMessage>(
      apiEndpoints.support.messages(payload.conversationId),
      payload,
    ),
}
