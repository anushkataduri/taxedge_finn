import { useCallback, useEffect, useRef, useState } from 'react'
import { messageFor } from '@core/errors'

import { supportService } from '../services/supportService'
import type {
  SupportAttachment,
  SupportConversation,
  SupportMessage,
} from '../types/support.types'

export const useSupportChat = (appId?: string, executiveId?: string) => {
  const [conversation, setConversation] = useState<SupportConversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const loadConversation = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await supportService.getConversation(appId, executiveId)
      if (mountedRef.current) {
        setConversation(data)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(messageFor(err))
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [appId, executiveId])

  useEffect(() => {
    mountedRef.current = true
    loadConversation()
    return () => {
      mountedRef.current = false
    }
  }, [loadConversation])

  const sendMessage = useCallback(
    async (text: string, attachments?: SupportAttachment[]) => {
      if (!conversation || !text.trim()) return

      try {
        setIsSending(true)
        const sentMessage = await supportService.sendMessage({
          conversationId: conversation.id,
          text: text.trim(),
          attachments,
        })

        if (mountedRef.current) {
          setConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...prev.messages, sentMessage],
                }
              : null,
          )
        }

        // Simulate executive acknowledgment if appropriate
        setTimeout(() => {
          if (!mountedRef.current) return
          const replyText =
            'Thank you for the update. Our team is actively reviewing this and will notify you as soon as the next stage is completed.'
          const replyMsg: SupportMessage = {
            id: `reply_${Date.now()}`,
            conversationId: conversation.id,
            senderId: conversation.executive.id,
            senderType: 'executive',
            senderName: conversation.executive.name,
            text: replyText,
            timestamp: new Date().toISOString(),
            formattedTime: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: 'read',
          }

          setConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...prev.messages, replyMsg],
                }
              : null,
          )
        }, 1500)
      } catch (err) {
        if (mountedRef.current) {
          setError(messageFor(err))
        }
      } finally {
        if (mountedRef.current) {
          setIsSending(false)
        }
      }
    },
    [conversation],
  )

  return {
    conversation,
    messages: conversation?.messages ?? [],
    isLoading,
    isSending,
    error,
    sendMessage,
    refetch: loadConversation,
  }
}
