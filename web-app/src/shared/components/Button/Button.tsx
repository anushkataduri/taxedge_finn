import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { classNames } from '../../utils/formatUtils'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    type={type}
    disabled={disabled ?? isLoading}
    aria-busy={isLoading || undefined}
    className={classNames(
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth && 'btn--block',
      isLoading && 'btn--loading',
      className,
    )}
  >
    {isLoading && <span className="btn__spinner" aria-hidden="true" />}
    {!isLoading && leftIcon && <span className="btn__icon">{leftIcon}</span>}
    <span className="btn__label">{children}</span>
    {!isLoading && rightIcon && <span className="btn__icon">{rightIcon}</span>}
  </button>
)
