import type { HTMLAttributes, ReactNode } from 'react'

import { classNames } from '../../utils/formatUtils'
import './Card.css'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  padded?: boolean
}

export const Card = ({
  title,
  subtitle,
  actions,
  footer,
  padded = true,
  className,
  children,
  ...rest
}: CardProps) => (
  <section {...rest} className={classNames('card', padded && 'card--padded', className)}>
    {(title || actions) && (
      <header className="card__header">
        <div>
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="card__actions">{actions}</div>}
      </header>
    )}
    <div className="card__body">{children}</div>
    {footer && <footer className="card__footer">{footer}</footer>}
  </section>
)
