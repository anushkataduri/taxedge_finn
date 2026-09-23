import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAuth } from '../../hooks/useAuth'
import { authFlowService } from '../../services/authFlowService'
import './OtpVerificationCard.css'

export interface OtpVerificationCardProps {
  mobile?: string
  countryCode?: string
}

export const OtpVerificationCard = ({
  mobile = '',
  countryCode = '+91',
}: OtpVerificationCardProps) => {
  const navigate = useNavigate()
  const { verifyOtp } = useAuth()
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [timerSeconds, setTimerSeconds] = useState(24)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Countdown timer effect
  useEffect(() => {
    if (timerSeconds <= 0) return

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timerSeconds])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
    const fullOtp = digits.join('')
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP code')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await verifyOtp({ mobile: mobile || '9867041255', otp: fullOtp })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (mobile) {
      await authFlowService.sendOtp(mobile)
    }
    setTimerSeconds(30)
    setError(null)
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
    <div className="otp-card">
      <div className="otp-card__top-nav">
        <button
          type="button"
          className="otp-card__back-btn"
          onClick={handleBack}
          aria-label="Back to enter mobile number"
        >
          <svg
            className="otp-card__back-icon"
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
          <span className="otp-card__back-label">Back</span>
        </button>
      </div>

      <header className="otp-card__header">
        <h2 className="otp-card__title">Enter the code</h2>
        <p className="otp-card__subtitle">
          Sent to {countryCode} {formatDisplayMobile(mobile)}.
          <button
            type="button"
            className="otp-card__change-link"
            onClick={handleBack}
          >
            Change
          </button>
        </p>
      </header>

      {/* 6 OTP Input Boxes */}
      <div className="otp-card__boxes" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`otp-card__box ${digit ? 'otp-card__box--filled' : ''} ${error ? 'otp-card__box--error' : ''}`}
            aria-label={`Digit ${index + 1}`}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {error && <div className="otp-card__error-text">{error}</div>}

      <button
        type="button"
        className="otp-card__btn-primary"
        onClick={handleVerify}
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? 'Verifying...' : 'Verify & continue'}</span>
        {!isSubmitting && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>

      {/* Resend Timer / Action */}
      <div className="otp-card__resend-row">
        <span>Did not get it?</span>
        {timerSeconds > 0 ? (
          <span>
            Resend in <strong className="otp-card__resend-highlight">{formatTimer(timerSeconds)}</strong>
          </span>
        ) : (
          <button type="button" className="otp-card__resend-btn" onClick={handleResend}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  )
}
