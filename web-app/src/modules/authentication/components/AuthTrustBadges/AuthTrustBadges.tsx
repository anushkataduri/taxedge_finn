import { SIGN_IN_TRUST_BADGES } from '../../constants/authData.constants'
import type { TrustBadgeData } from '../../constants/authData.constants'
import './AuthTrustBadges.css'

export const AuthTrustBadges = () => {
  const renderIcon = (type: TrustBadgeData['iconType']) => {
    switch (type) {
      case 'shield':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        )
      case 'expert':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      case 'process':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-trust-badges" aria-label="Trust and security badges">
      {SIGN_IN_TRUST_BADGES.map((badge) => (
        <div key={badge.id} className="auth-trust-badges__badge">
          <span className="auth-trust-badges__icon">{renderIcon(badge.iconType)}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  )
}
