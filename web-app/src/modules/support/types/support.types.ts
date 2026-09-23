import type { ApplicationStatus, Timestamped } from '@shared/types'

export type ExecutiveStatus = 'Online' | 'Away' | 'Offline'

export interface SupportExecutive {
  id: string
  name: string
  role: string
  department: string
  avatarInitials: string
  avatarColor?: string
  status: ExecutiveStatus
  phone?: string
  email?: string
  assignedAppId?: string
}

export interface SupportAttachment {
  id: string
  name: string
  size: string
  type: string
  url?: string
}

export interface SupportMessage {
  id: string
  conversationId: string
  senderId: string
  senderType: 'user' | 'executive' | 'system'
  senderName: string
  text: string
  timestamp: string
  formattedTime: string
  status?: 'sent' | 'delivered' | 'read'
  attachments?: SupportAttachment[]
}

export interface SupportConversation {
  id: string
  applicationId: string
  applicationRef: string
  serviceName: string
  dateLabel: string
  executive: SupportExecutive
  messages: SupportMessage[]
}

export interface SupportContactMethod {
  id: string
  type: 'phone' | 'whatsapp' | 'email' | 'hours'
  label: string
  value: string
  actionUrl?: string
  icon: string
}

export interface SendMessagePayload {
  conversationId: string
  text: string
  attachments?: SupportAttachment[]
}

export interface SupportItem extends Timestamped {
  id: string
  reference: string
  title: string
  status: ApplicationStatus
  amount?: number
}

export interface SupportFilters {
  status?: ApplicationStatus
  search?: string
}
