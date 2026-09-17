import { Link, useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import './GetStartedCard.css'

export const GetStartedCard = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate(routePaths.auth.login)
  }

  return (
    <div className="get-started-card">
      <header className="get-started-card__header">
        <h2 className="get-started-card__title">Get started</h2>
        <div className="get-started-card__accent-bar" />
        <p className="get-started-card__subtitle">
          <span>Create your TaxEdge account in under two minutes.</span>
          <span>All you need is your mobile number.</span>
        </p>
      </header>

      <div className="get-started-card__actions">
        <button
          type="button"
          className="get-started-card__btn-primary"
          onClick={handleGetStarted}
        >
          <span>Get Started</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <Link to={routePaths.auth.login} className="get-started-card__btn-secondary">
          <span className="get-started-card__user-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span>I already have an account</span>
        </Link>
      </div>

      <div className="get-started-card__privacy-banner">
        <div className="get-started-card__privacy-icon">
          <svg viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 1L2 7V19.5C2 29.6 8.8 38.1 18 40.5C27.2 38.1 34 29.6 34 19.5V7L18 1Z"
              fill="#2563EB"
            />
            <rect x="13" y="20" width="10" height="9" rx="1.5" fill="#FF8A00" />
            <path d="M15 20V17C15 15.3 16.3 14 18 14C19.7 14 21 15.3 21 17V20" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="24.5" r="1.2" fill="#FFFFFF" />
          </svg>
        </div>
        <div className="get-started-card__privacy-content">
          <div className="get-started-card__privacy-title">Your documents stay private</div>
          <div className="get-started-card__privacy-desc">
            Encrypted storage, role-based staff access and a full audit log on every file you upload.
          </div>
        </div>
      </div>

      <p className="get-started-card__footer">
        By continuing you agree to the{' '}
        <a href="#terms" className="get-started-card__link" onClick={(e) => e.preventDefault()}>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#privacy" className="get-started-card__link" onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
