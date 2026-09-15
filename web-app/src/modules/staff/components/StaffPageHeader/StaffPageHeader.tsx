import type { ReactNode } from 'react'

import './StaffPageHeader.css'

export interface StaffPageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumb?: ReactNode
}

export const StaffPageHeader = ({ title, subtitle, actions, breadcrumb }: StaffPageHeaderProps) => (
  <header className="staff-page-header">
    {breadcrumb && <nav className="staff-page-header__breadcrumb">{breadcrumb}</nav>}
    <div className="staff-page-header__row">
      <div>
        <h1 className="staff-page-header__title">{title}</h1>
        {subtitle && <p className="staff-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="staff-page-header__actions">{actions}</div>}
    </div>
  </header>
)
