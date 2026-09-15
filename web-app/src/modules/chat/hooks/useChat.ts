import { useAsync } from '@shared/hooks'

import { chatService } from '../services/chatService'
import type { ChatItem } from '../types/chat.types'

export const useChat = () => useAsync<ChatItem[]>(() => chatService.list(), [])
