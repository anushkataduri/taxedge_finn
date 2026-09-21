import { useState, useRef } from 'react'
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAuth } from '../../hooks/useAuth'
import { authFlowService } from '../../services/authFlowService'
import './PasscodeCard.css'

export interface PasscodeCardProps {
  mobile?: string
  countryCode?: string
}

export const PasscodeCard = ({
  mobile = '',
  countryCode = '+91',
}: PasscodeCardProps) => {
  const navigate = useNavigate()
  const { verifyPasscode } = useAuth()
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [showPasscode, setShowPasscode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleDigitChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    const nextDigits = [...digits]
    nextDigits[index] = val
    setDigits(nextDigits)
    if (error) setError(null)

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const nextDigits = [...digits]
        nextDigits[index] = ''
        setDigits(nextDigits)
      }
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const nextDigits = [...digits]
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pasted[i] ?? ''
    }
    setDigits(nextDigits)
    if (error) setError(null)

    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  const handleVerify = async () => {
    const fullPasscode = digits.join('')
    if (fullPasscode.length < 6) {
      setError('Please enter your complete 6-digit passcode')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await verifyPasscode({ mobile: mobile || '9867041255', passcode: fullPasscode })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect passcode. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignInWithOtp = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const cleanMobile = mobile.replace(/\D/g, '').trim()
      if (cleanMobile) {
        try {
          await authFlowService.sendOtp(cleanMobile)
        } catch (err) {
          console.warn('sendOtp notice:', err)
        }
      }
      navigate(routePaths.auth.otp, {
        state: {
          mobile: cleanMobile || '9867041255',
          countryCode,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send OTP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate(routePaths.auth.login, {
      state: {
        initialMobile: mobile,
      },
    })
  }

  const formatDisplayMobile = (num: string) => {
    const clean = num.replace(/\D/g, '')
    if (clean.length === 10) {
      return `${clean.slice(0, 5)} ${clean.slice(5)}`
    }
    return num || '98670 41255'
  }

  return (
    <div className="passcode-card">
      <div className="passcode-card__top-nav">
        <button
          type="button"
          className="passcode-card__back-btn"
          onClick={handleBack}
          aria-label="Back to enter mobile number"
        >
          <svg
            className="passcode-card__back-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="passcode-card__back-label">Back</span>
        </button>
      </div>

      <header className="passcode-card__header">
        <h2 className="passcode-card__title">Enter passcode</h2>
        <p className="passcode-card__subtitle">
          Enter your 6-digit passcode for {countryCode} {formatDisplayMobile(mobile)}.
          <button
            type="button"
            className="passcode-card__change-link"
            onClick={handleBack}
          >
            Change
          </button>
        </p>
      </header>

      {/* 6 Passcode Input Boxes */}
      <div className="passcode-card__boxes" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type={showPasscode ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`passcode-card__box ${digit ? 'passcode-card__box--filled' : ''} ${error ? 'passcode-card__box--error' : ''}`}
            aria-label={`Digit ${index + 1}`}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <div className="passcode-card__meta-row">
        <button
          type="button"
          className="passcode-card__toggle-btn"
          onClick={() => setShowPasscode((prev) => !prev)}
        >
          {showPasscode ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <span>Hide passcode</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Show passcode</span>
            </>
          )}
        </button>
      </div>

      {error && <div className="passcode-card__error-text">{error}</div>}

      <button
        type="button"
        className="passcode-card__btn-primary"
        onClick={handleVerify}
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? 'Verifying...' : 'Sign in'}</span>
        {!isSubmitting && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>

      {/* Helper info */}
      <div className="passcode-card__footer-row">
        <span>Forgot your passcode?</span>
        <button
          type="button"
          className="passcode-card__reset-btn"
          onClick={handleSignInWithOtp}
          disabled={isSubmitting}
        >
          Sign in with OTP
        </button>
      </div>
    </div>
  )
}

