import { FINANCIAL_OVERVIEW_ITEMS } from '../../constants/authData.constants'
import type { OverviewItem } from '../../constants/authData.constants'
import './AuthOverviewCard.css'

export const AuthOverviewCard = () => {
  const renderIcon = (type: OverviewItem['iconType']) => {
    switch (type) {
      case 'bank':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 2L2 7h20L12 2z" />
          </svg>
        )
      case 'document':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      case 'wallet':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            <path d="M16 3H4a2 2 0 0 0-2 2v2h18V5a2 2 0 0 0-2-2z" />
            <circle cx="16" cy="14" r="1.5" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-overview-card" aria-label="Financial Overview">
      <div className="auth-overview-card__header">
        <span className="auth-overview-card__header-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </span>
        <span>Your financial overview</span>
      </div>

      <div className="auth-overview-card__list">
        {FINANCIAL_OVERVIEW_ITEMS.map((item) => (
          <div key={item.id} className="auth-overview-card__item">
            <div className="auth-overview-card__item-left">
              <div className="auth-overview-card__icon-box">
                {renderIcon(item.iconType)}
              </div>
              <span className="auth-overview-card__item-title">{item.title}</span>
            </div>

            {item.badgeLabel && (
              <span className={`auth-overview-card__badge auth-overview-card__badge--${item.badgeType ?? 'info'}`}>
                <span className="auth-overview-card__badge-dot" />
                {item.badgeLabel}
              </span>
            )}

            {item.highlightText && (
              <div className="auth-overview-card__refund-info">
                <span className="auth-overview-card__refund-value">{item.highlightText}</span>
                {item.subText && <span className="auth-overview-card__refund-subtext">{item.subText}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
