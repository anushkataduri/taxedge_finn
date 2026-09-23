import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { authFlowService } from '../../services/authFlowService'
import { COUNTRY_CODES } from '../../constants/authData.constants'
import './SignInCard.css'

export interface SignInCardProps {
  initialMobile?: string
}

export const SignInCard = ({ initialMobile = '' }: SignInCardProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as { forceOtp?: boolean } | null
  const [mobile, setMobile] = useState(initialMobile)
  const [countryIndex, setCountryIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCountry = COUNTRY_CODES[countryIndex] ?? COUNTRY_CODES[0]

  const handleMobileChange = (value: string) => {
    // Keep only digits and max 10
    const numeric = value.replace(/\D/g, '').slice(0, 10)
    setMobile(numeric)
    if (error) setError(null)
  }

  const toggleCountry = () => {
    setCountryIndex((prev) => (prev + 1) % COUNTRY_CODES.length)
  }

  const handleSendOtp = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    const cleanMobile = mobile.replace(/\D/g, '').trim()
    
    // Strict validation
    if (!cleanMobile) {
      setError('Please enter your 10-digit mobile number')
      return
    }
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const isAlreadyRegistered = authFlowService.isRegistered(cleanMobile)

      if (isAlreadyRegistered && !locationState?.forceOtp) {
        // Returning user: skip OTP verification, navigate directly to passcode entry
        navigate(routePaths.auth.passcode, {
          state: {
            mobile: cleanMobile,
            countryCode: selectedCountry.code,
          },
        })
        return
      }

      // Trigger OTP verification
      try {
        await authFlowService.sendOtp(cleanMobile)
      } catch (err) {
        console.warn('sendOtp notice:', err)
      }

      // Navigate to OTP verification page
      navigate(routePaths.auth.otp, {
        state: {
          mobile: cleanMobile,
          countryCode: selectedCountry.code,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to proceed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePanSignIn = async () => {
    const cleanMobile = mobile.replace(/\D/g, '').trim() || '9867041255'
    setMobile(cleanMobile)
    setError(null)
    setIsSubmitting(true)
    try {
      await authFlowService.sendOtp(cleanMobile)
      navigate(routePaths.auth.otp, {
        state: {
          mobile: cleanMobile,
          countryCode: selectedCountry.code,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="sign-in-card">
      <header className="sign-in-card__header">
        <h2 className="sign-in-card__title">Sign in</h2>
        <p className="sign-in-card__subtitle">
          We will send a 6-digit code to your registered mobile number.
        </p>
      </header>

      <form className="sign-in-card__form" onSubmit={handleSendOtp} noValidate>
        <div className="sign-in-card__field">
          <label htmlFor="mobile-input" className="sign-in-card__label">
            Mobile number
          </label>
          <div className="sign-in-card__input-group">
            <button
              type="button"
              className="sign-in-card__country-select"
              title={`Country: ${selectedCountry.label}. Click to switch.`}
              onClick={toggleCountry}
            >
              <span>{selectedCountry.code}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div className="sign-in-card__input-wrapper">
              <input
                id="mobile-input"
                type="tel"
                className={`sign-in-card__input ${error ? 'sign-in-card__input--error' : ''}`}
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                maxLength={10}
                autoComplete="tel-national"
                autoFocus
              />
            </div>
          </div>

          {error && <span className="sign-in-card__error-msg">{error}</span>}
        </div>

        <button
          type="submit"
          className="sign-in-card__btn-primary"
          disabled={isSubmitting}
          onClick={handleSendOtp}
        >
          <span>{isSubmitting ? 'Continuing...' : 'Continue'}</span>
          {!isSubmitting && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>

        <div className="sign-in-card__divider">or</div>

        <button
          type="button"
          className="sign-in-card__btn-secondary"
          onClick={handlePanSignIn}
        >
          <span className="sign-in-card__btn-secondary-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span>Sign in with PAN</span>
        </button>
      </form>

      <p className="sign-in-card__footer">
        New to TaxEdge?
        <Link to={routePaths.auth.createProfile} className="sign-in-card__link">
          Create an account
        </Link>
      </p>
    </div>
  )
}
