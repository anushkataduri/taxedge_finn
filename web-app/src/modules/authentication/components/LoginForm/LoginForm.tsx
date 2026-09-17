import { Link } from 'react-router-dom'

import { routePaths } from '@core/config'
import { Button, Input } from '@shared/components'
import { useZodForm } from '@shared/hooks'

import { loginSchema } from '../../validation/authSchema'
import type { LoginInput } from '../../validation/authSchema'
import './LoginForm.css'

export interface LoginFormProps {
  onSubmit: (values: LoginInput) => Promise<void>
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const form = useZodForm(loginSchema, { mobile: '', password: '' }, onSubmit)

  return (
    <form className="login-form" onSubmit={form.handleSubmit} noValidate>
      <Input
        name="mobile"
        label="Mobile number"
        inputMode="numeric"
        maxLength={10}
        autoComplete="tel-national"
        prefix="+91"
        placeholder="9876543210"
        value={form.values.mobile}
        error={form.errors.mobile}
        onChange={form.handleChange}
        required
      />

      <Input
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Your password"
        value={form.values.password}
        error={form.errors.password}
        onChange={form.handleChange}
        required
      />

      {form.errors.form && <p className="login-form__error">{form.errors.form}</p>}

      <Button type="submit" fullWidth size="lg" isLoading={form.isSubmitting}>
        Sign in
      </Button>

      <p className="login-form__alt">
        <Link to={routePaths.auth.otp}>Sign in with OTP instead</Link>
      </p>
    </form>
  )
}
