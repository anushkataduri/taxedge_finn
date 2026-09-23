import type { HTMLAttributes } from 'react'
import { classNames } from '../../utils/formatUtils'
import './Logo.css'

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'
export type LogoVariant = 'dark' | 'light'

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: LogoSize
  variant?: LogoVariant
  showText?: boolean
  subtitle?: string
}

export const Logo = ({
  size = 'md',
  variant = 'light',
  showText = true,
  subtitle,
  className,
  ...rest
}: LogoProps) => (
  <div
    {...rest}
    className={classNames(
      'taxedge-logo',
      `taxedge-logo--${size}`,
      `taxedge-logo--${variant}`,
      className,
    )}
  >
    <img
      src={variant === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt="TaxEdge Logo"
      className="taxedge-logo__img"
      loading="eager"
    />
    {showText && (
      <div className="taxedge-logo__text-group">
        <span className="taxedge-logo__title">
          <span className="taxedge-logo__brand-tax">TAX</span>
          <span className="taxedge-logo__brand-edge">EDGE</span>
        </span>
        {subtitle && <span className="taxedge-logo__subtitle">{subtitle}</span>}
      </div>
    )}
  </div>
)
