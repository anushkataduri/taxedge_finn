import { useState } from 'react'
import { Button, Input } from '@shared/components'
import { useZodForm } from '@shared/hooks'

import { registerSchema } from '../../validation/authSchema'
import type { RegisterInput } from '../../validation/authSchema'
import './RegisterForm.css'

export interface RegisterFormProps {
  onSubmit: (values: RegisterInput) => Promise<void>
}

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const form = useZodForm(
    registerSchema,
    { fullName: '', email: '', mobile: '', password: '' },
    onSubmit,
  )

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    form.handleChange({
      target: { name: 'mobile', value: digits },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const passwordVal = form.values.password || ''
  const hasMinLength = passwordVal.length >= 8
  const hasUppercase = /[A-Z]/.test(passwordVal)
  const hasNumber = /[0-9]/.test(passwordVal)

  return (
    <form className="register-form" onSubmit={form.handleSubmit} noValidate>
      <Input
        id="register-fullName"
        name="fullName"
        label="Full name"
        autoComplete="name"
        placeholder="Enter your full name as per PAN"
        value={form.values.fullName}
        error={form.errors.fullName}
        onChange={form.handleChange}
        required
      />

      <Input
        id="register-email"
        name="email"
        type="email"
        label="Email address"
        autoComplete="email"
        placeholder="you@company.com"
        value={form.values.email}
        error={form.errors.email}
        onChange={form.handleChange}
        required
      />

      <Input
        id="register-mobile"
        name="mobile"
        label="Mobile number"
        inputMode="numeric"
        maxLength={10}
        prefix="+91"
        placeholder="98765 43210"
        value={form.values.mobile}
        error={form.errors.mobile}
        onChange={handleMobileChange}
        required
      />

      <div className="register-form__password-field">
        <Input
          id="register-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Create password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.values.password}
          error={form.errors.password}
          onChange={form.handleChange}
          required
          suffix={
            <button
              type="button"
              className="register-form__password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          }
        />

        {/* Password Strength Requirements Helper */}
        {passwordVal.length > 0 && !form.errors.password && (
          <div className="register-form__password-hints" aria-live="polite">
            <span className={`register-form__hint-pill ${hasMinLength ? 'register-form__hint-pill--valid' : ''}`}>
              {hasMinLength ? '✓' : '•'} 8+ characters
            </span>
            <span className={`register-form__hint-pill ${hasUppercase ? 'register-form__hint-pill--valid' : ''}`}>
              {hasUppercase ? '✓' : '•'} 1 uppercase
            </span>
            <span className={`register-form__hint-pill ${hasNumber ? 'register-form__hint-pill--valid' : ''}`}>
              {hasNumber ? '✓' : '•'} 1 number
            </span>
          </div>
        )}
      </div>

      {form.errors.form && (
        <div className="register-form__error" role="alert">
          <svg className="register-form__error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{form.errors.form}</span>
        </div>
      )}

      <p className="register-form__terms">
        By registering, you agree to TaxEdge's{' '}
        <span className="register-form__terms-link">Terms of Service</span> and{' '}
        <span className="register-form__terms-link">Privacy Policy</span>.
      </p>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={form.isSubmitting}
        className="register-form__submit-btn"
      >
        Create account →
      </Button>
    </form>
  )
}

