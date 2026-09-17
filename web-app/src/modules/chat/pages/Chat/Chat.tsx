import { Badge, Card, EmptyState, Loader } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import { formatDate } from '@shared/utils'

import { useChat } from '../../hooks/useChat'
import './Chat.css'

export const Chat = () => {
  const { data, isLoading, error } = useChat()

  return (
    <div className="chat-page">
      <header className="chat-page__header">
        <h1 className="chat-page__title">Chat</h1>
        <p className="chat-page__subtitle">Talk to your assigned tax expert.</p>
      </header>

      {isLoading && <Loader label="Loading Chat" />}
      {error && <EmptyState title="Could not load Chat" description={error} />}

      {!isLoading && !error && (
        <Card title="Chat" subtitle="Wire this module up to the real API in services/chatService.ts">
          <ul className="chat-page__list">
            {(data ?? []).map((item) => (
              <li className="chat-page__row" key={item.id}>
                <div>
                  <p className="chat-page__row-title">{item.title}</p>
                  <p className="chat-page__row-meta">
                    {item.reference} · {formatDate(item.updatedAt)}
                  </p>
                </div>
                <Badge tone={STATUS_TONES[item.status]}>{STATUS_LABELS[item.status]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

export default Chat
