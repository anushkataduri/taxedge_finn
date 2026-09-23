import React from 'react'
import { GET_STARTED_STATS } from '../../constants/authData.constants'
import type { BottomStat } from '../../constants/authData.constants'
import './AuthStatsBar.css'

export const AuthStatsBar = () => {
  const renderIcon = (type: BottomStat['iconType']) => {
    switch (type) {
      case 'returns':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        )
      case 'loans':
        return (
          <span style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1 }}>₹</span>
        )
      case 'rating':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="auth-stats-bar" aria-label="Key statistics">
      {GET_STARTED_STATS.map((stat, index) => (
        <React.Fragment key={stat.id}>
          {index > 0 && <div className="auth-stats-bar__divider" />}
          <div className="auth-stats-bar__item">
            <div className="auth-stats-bar__icon-circle">
              {renderIcon(stat.iconType)}
            </div>
            <div className="auth-stats-bar__text">
              <span className="auth-stats-bar__value">{stat.value}</span>
              <span className="auth-stats-bar__label">{stat.label}</span>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
