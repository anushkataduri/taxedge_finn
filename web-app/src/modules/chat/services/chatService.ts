import { env } from '@core/config'

import { chatApi } from '../api/chatApi'
import type { ChatFilters, ChatItem } from '../types/chat.types'

/* Development mock - delete once the API is live. */
const mockItems: ChatItem[] = [
  {
    id: 'chat_001',
    reference: 'TE-Chat-0001',
    title: 'Sample conversation',
    status: 'MANAGER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const chatService = {
  async list(filters?: ChatFilters): Promise<ChatItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockItems
    }
    const response = await chatApi.list(filters)
    return response.data
  },
}
