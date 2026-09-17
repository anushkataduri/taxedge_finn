import type { SupportMessage } from '../../types/support.types'
import './ChatMessageItem.css'

interface ChatMessageItemProps {
  message: SupportMessage
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const isUser = message.senderType === 'user'

  return (
    <div
      className={`chat-msg-item ${
        isUser ? 'chat-msg-item--user' : 'chat-msg-item--executive'
      }`}
    >
      <div className="chat-msg-item__bubble">
        <p className="chat-msg-item__text">{message.text}</p>

        {message.attachments && message.attachments.length > 0 && (
          <div className="chat-msg-item__attachments">
            {message.attachments.map((file) => (
              <div key={file.id} className="chat-msg-item__attachment-file">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="chat-msg-item__attachment-icon"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="chat-msg-item__attachment-name">{file.name}</span>
                <span className="chat-msg-item__attachment-size">{file.size}</span>
              </div>
            ))}
          </div>
        )}

        <div className="chat-msg-item__meta">
          <span className="chat-msg-item__time">{message.formattedTime}</span>
          {isUser && message.status && (
            <span className="chat-msg-item__status" title={message.status}>
              {message.status === 'read' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
