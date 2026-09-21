import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  ChatWindow,
  ExecutiveList,
  SecurityNotice,
  SupportContactInfo,
} from '../../components'
import { useSupportChat } from '../../hooks/useSupportChat'
import { useSupportExecutives } from '../../hooks/useSupportExecutives'
import { supportService } from '../../services/supportService'
import type { SupportExecutive } from '../../types/support.types'
import './Support.css'

export const Support = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const appId = searchParams.get('appId') || undefined
  const executiveId = searchParams.get('executiveId') || undefined

  const {
    conversation,
    isLoading: isChatLoading,
    isSending,
    sendMessage,
  } = useSupportChat(appId, executiveId)

  const {
    executives,
  } = useSupportExecutives()

  const contactMethods = useMemo(() => supportService.getContactMethods(), [])
  const securityNotice = useMemo(() => supportService.getSecurityNotice(), [])

  const handleSelectExecutive = (exec: SupportExecutive) => {
    const nextParams: Record<string, string> = {
      executiveId: exec.id,
    }
    if (exec.assignedAppId) {
      nextParams.appId = exec.assignedAppId
    }
    setSearchParams(nextParams)
  }

  return (
    <div className="support-view">
      {/* Breadcrumb Navigation */}
      <nav className="support-view__breadcrumb" aria-label="Breadcrumb">
        <span className="support-view__breadcrumb-parent">My Account</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="support-view__breadcrumb-arrow"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="support-view__breadcrumb-current">Support</span>
      </nav>

      {/* Page Header */}
      <header className="support-view__header">
        <h1 className="support-view__title">Support</h1>
        <p className="support-view__subtitle">
          Talk to the executive handling your application — not a general queue.
        </p>
      </header>

      {/* Main Grid Layout */}
      <div className="support-view__grid">
        {/* Left: Chat Window Panel */}
        <div className="support-view__chat-col">
          <ChatWindow
            conversation={conversation}
            isLoading={isChatLoading}
            isSending={isSending}
            onSendMessage={sendMessage}
          />
        </div>

        {/* Right: Sidebar with Executives, Contacts, and Security Card */}
        <aside className="support-view__sidebar-col">
          <ExecutiveList
            executives={executives}
            activeExecutiveId={conversation?.executive.id}
            onSelectExecutive={handleSelectExecutive}
          />

          <SupportContactInfo contacts={contactMethods} />

          <SecurityNotice
            title={securityNotice.title}
            body={securityNotice.body}
          />
        </aside>
      </div>
    </div>
  )
}

export default Support
