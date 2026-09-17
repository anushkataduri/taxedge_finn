import { Link, useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import './AppHeader.css'

export interface AppHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onToggleMobileMenu?: () => void
}

export const AppHeader = ({
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
}: AppHeaderProps) => {
  const navigate = useNavigate()

  return (
    <header className="app-header">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="app-header__left">
        <button
          type="button"
          className="app-header__mobile-toggle"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <nav className="app-header__breadcrumb" aria-label="Breadcrumb">
          <Link to={routePaths.dashboard} className="app-header__breadcrumb-home">
            Home
          </Link>
          <span className="app-header__breadcrumb-sep" aria-hidden="true">&gt;</span>
          <span className="app-header__breadcrumb-current" aria-current="page">
            All Services
          </span>
        </nav>
      </div>

      {/* Center: Search Field */}
      <div className="app-header__search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-header__search-icon" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search applications, documents..."
          className="app-header__search-input"
          aria-label="Search applications, documents, or services"
        />

        {searchQuery && (
          <button
            type="button"
            className="app-header__search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search text"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="app-header__actions">
        {/* Notifications Icon with Indicator */}
        <button
          type="button"
          className="app-header__icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-header__btn-icon">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="app-header__badge-dot" aria-hidden="true" />
        </button>

        {/* Message Icon with Indicator */}
        <button
          type="button"
          className="app-header__icon-btn"
          aria-label="Messages & Support"
          title="Messages"
          onClick={() => navigate(routePaths.support)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-header__btn-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="app-header__badge-dot" aria-hidden="true" />
        </button>

        {/* Menu / Grid Icon */}
        <button
          type="button"
          className="app-header__icon-btn"
          aria-label="Quick Apps Grid"
          title="TaxEdge Quick Apps"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-header__btn-icon">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>
    </header>
  )
}
