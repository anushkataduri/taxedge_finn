import { useState } from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import './AuthBrandLogo.css'

export interface AuthBrandLogoProps {
  to?: string
  className?: string
}

export const AuthBrandLogo = ({ to = routePaths.root, className = '' }: AuthBrandLogoProps) => {
  const [imgError, setImgError] = useState(false)

  return (
    <Link to={to} className={`auth-brand-logo ${className}`}>
      {!imgError ? (
        <img
          src="/logo.png"
          alt="TaxEdge Logo"
          className="auth-brand-logo__img"
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <div className="auth-brand-logo__emblem">
            <svg
              className="auth-brand-logo__svg"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7 10H21M14 10V26"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="20" y="19" width="2.8" height="7" rx="1.2" fill="#FF8A00" />
              <rect x="24.5" y="15" width="2.8" height="11" rx="1.2" fill="#FF7000" />
              <rect x="29" y="11" width="2.8" height="15" rx="1.2" fill="#FF5000" />
              <path
                d="M19 22L24.5 14.5L29.5 9.5M29.5 9.5H25.5M29.5 9.5V13.5"
                stroke="#FFB03A"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="auth-brand-logo__content">
            <span className="auth-brand-logo__title">TaxEdge</span>
            <span className="auth-brand-logo__subtitle">FIN SOLUTIONS</span>
          </div>
        </>
      )}
    </Link>
  )
}
