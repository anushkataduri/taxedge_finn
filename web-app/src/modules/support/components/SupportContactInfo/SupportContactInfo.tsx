import type { SupportContactMethod } from '../../types/support.types'
import './SupportContactInfo.css'

interface SupportContactInfoProps {
  contacts: SupportContactMethod[]
}

export const SupportContactInfo = ({ contacts }: SupportContactInfoProps) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )
      case 'whatsapp':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )
      case 'email':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        )
      case 'hours':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )
    }
  }

  return (
    <div className="support-contact-card">
      <h3 className="support-contact-card__title">Other ways to reach us</h3>

      <div className="support-contact-card__list">
        {contacts.map((contact) => {
          const isLink = Boolean(contact.actionUrl)
          const content = (
            <>
              <div className="support-contact-card__icon">{renderIcon(contact.type)}</div>
              <span className="support-contact-card__value">{contact.value}</span>
            </>
          )

          return isLink ? (
            <a
              key={contact.id}
              href={contact.actionUrl}
              target={contact.type === 'whatsapp' ? '_blank' : undefined}
              rel={contact.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
              className="support-contact-card__item support-contact-card__item--link"
            >
              {content}
            </a>
          ) : (
            <div key={contact.id} className="support-contact-card__item">
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
