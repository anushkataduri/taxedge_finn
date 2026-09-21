import { SIGN_IN_METRIC_CARDS } from '../../constants/authData.constants'
import type { MetricCardData } from '../../constants/authData.constants'
import './AuthMetricCards.css'

export const AuthMetricCards = () => {
  const renderIcon = (type: MetricCardData['iconType']) => {
    switch (type) {
      case 'applications':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        )
      case 'calendar':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        )
      case 'documents':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-metric-cards">
      {SIGN_IN_METRIC_CARDS.map((card) => (
        <div key={card.id} className="auth-metric-cards__card">
          <div className="auth-metric-cards__icon-circle">
            {renderIcon(card.iconType)}
          </div>
          <span className="auth-metric-cards__count">{card.count}</span>
          <span className="auth-metric-cards__label">{card.label}</span>
        </div>
      ))}
    </div>
  )
}
