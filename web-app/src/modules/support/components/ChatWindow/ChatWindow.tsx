import { useEffect, useRef } from 'react'
import type { SupportAttachment, SupportConversation } from '../../types/support.types'
import { ChatMessageItem } from '../ChatMessageItem/ChatMessageItem'
import { ChatMessageInput } from '../ChatMessageInput/ChatMessageInput'
import './ChatWindow.css'

interface ChatWindowProps {
  conversation: SupportConversation | null
  isLoading?: boolean
  isSending?: boolean
  onSendMessage: (text: string, attachments?: SupportAttachment[]) => void
}

export const ChatWindow = ({
  conversation,
  isLoading = false,
  isSending = false,
  onSendMessage,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  if (isLoading || !conversation) {
    return (
      <div className="chat-window chat-window--loading">
        <div className="chat-window__skeleton-header" />
        <div className="chat-window__skeleton-body" />
      </div>
    )
  }

  const { executive, messages, applicationRef, dateLabel } = conversation

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <header className="chat-window__header">
        <div className="chat-window__header-left">
          <div
            className="chat-window__avatar"
            style={{ backgroundColor: executive.avatarColor || '#059669' }}
          >
            {executive.avatarInitials}
          </div>
          <div className="chat-window__executive-info">
            <h2 className="chat-window__executive-name">{executive.name}</h2>
            <div className="chat-window__executive-status-row">
              <span
                className={`chat-window__status-dot chat-window__status-dot--${executive.status.toLowerCase()}`}
              />
              <span className="chat-window__status-text">
                {executive.status} · {executive.role}
              </span>
            </div>
          </div>
        </div>

        <div className="chat-window__header-right">
          <span className="chat-window__app-badge" title="Application Reference">
            {applicationRef}
          </span>
        </div>
      </header>

      {/* Messages Thread */}
      <div className="chat-window__body">
        {dateLabel && (
          <div className="chat-window__date-divider">
            <span className="chat-window__date-pill">{dateLabel}</span>
          </div>
        )}

        <div className="chat-window__messages-list">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Footer */}
      <footer className="chat-window__footer">
        <ChatMessageInput
          onSendMessage={onSendMessage}
          disabled={isSending}
          placeholder="Write a message..."
        />
      </footer>
    </div>
  )
}
