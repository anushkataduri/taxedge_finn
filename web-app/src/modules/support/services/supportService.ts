import { env } from '@core/config'

import { supportApi } from '../api/supportApi'
import {
  INITIAL_SUPPORT_CONVERSATIONS,
  SECURITY_NOTICE_CONTENT,
  SUPPORT_CONTACT_METHODS,
  SUPPORT_EXECUTIVES,
} from '../constants/support.constants'
import type {
  SendMessagePayload,
  SupportContactMethod,
  SupportConversation,
  SupportExecutive,
  SupportFilters,
  SupportItem,
  SupportMessage,
} from '../types/support.types'

/* Development mock store - maintains reactive session state */
const conversationsStore: Record<string, SupportConversation> = {
  ...INITIAL_SUPPORT_CONVERSATIONS,
}

const mockTickets: SupportItem[] = [
  {
    id: 'support_001',
    reference: 'TE-Support-0001',
    title: 'GST Monthly Filing query',
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const formatTimeNow = (): string => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const supportService = {
  async list(filters?: SupportFilters): Promise<SupportItem[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return mockTickets.filter((item) => {
        if (filters?.status && item.status !== filters.status) return false
        if (
          filters?.search &&
          !item.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !item.reference.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false
        }
        return true
      })
    }
    const response = await supportApi.list(filters)
    return response.data
  },

  async getExecutives(): Promise<SupportExecutive[]> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 150))
      return SUPPORT_EXECUTIVES
    }
    return supportApi.getExecutives()
  },

  async getConversation(
    appId?: string,
    executiveId?: string,
  ): Promise<SupportConversation> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 150))

      const targetKey =
        (appId && conversationsStore[appId] ? appId : null) ||
        Object.keys(conversationsStore).find((key) => {
          const conv = conversationsStore[key]
          return executiveId ? conv.executive.id === executiveId : false
        }) ||
        'GST-2026-00118'

      if (conversationsStore[targetKey]) {
        return conversationsStore[targetKey]
      }

      // Create dynamic fallback conversation if not found
      const matchingExec =
        SUPPORT_EXECUTIVES.find((exec) => exec.id === executiveId) ||
        SUPPORT_EXECUTIVES[0]

      const newConversation: SupportConversation = {
        id: `conv_${appId || 'general'}`,
        applicationId: appId || '1',
        applicationRef: appId || 'GST-2026-00118',
        serviceName: matchingExec.department,
        dateLabel: `Application ${appId || 'GST-2026-00118'} · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        executive: matchingExec,
        messages: [
          {
            id: `msg_init_${Date.now()}`,
            conversationId: `conv_${appId || 'general'}`,
            senderId: matchingExec.id,
            senderType: 'executive',
            senderName: matchingExec.name,
            text: `Hello! I am ${matchingExec.name}, your assigned executive. How can I assist you with ${appId || 'your application'}?`,
            timestamp: new Date().toISOString(),
            formattedTime: formatTimeNow(),
            status: 'read',
          },
        ],
      }

      conversationsStore[appId || targetKey] = newConversation
      return newConversation
    }

    return supportApi.getConversation(appId || 'default')
  },

  async sendMessage(payload: SendMessagePayload): Promise<SupportMessage> {
    if (env.enableMocks) {
      await new Promise((resolve) => setTimeout(resolve, 100))

      const newMessage: SupportMessage = {
        id: `msg_${Date.now()}`,
        conversationId: payload.conversationId,
        senderId: 'user_current',
        senderType: 'user',
        senderName: 'You',
        text: payload.text,
        timestamp: new Date().toISOString(),
        formattedTime: formatTimeNow(),
        status: 'delivered',
        attachments: payload.attachments,
      }

      // Append dynamically using functional map / immutability
      Object.keys(conversationsStore).forEach((key) => {
        const conv = conversationsStore[key]
        if (conv.id === payload.conversationId) {
          conversationsStore[key] = {
            ...conv,
            messages: [...conv.messages, newMessage],
          }
        }
      })

      return newMessage
    }

    return supportApi.sendMessage(payload)
  },

  getContactMethods(): SupportContactMethod[] {
    return SUPPORT_CONTACT_METHODS
  },

  getSecurityNotice() {
    return SECURITY_NOTICE_CONTENT
  },
}
