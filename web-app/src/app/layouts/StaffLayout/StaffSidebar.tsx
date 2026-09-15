import { NavLink } from 'react-router-dom'

import { permissionsFor } from '@core/auth'
import type { UserRole } from '@core/auth'
import { routePaths } from '@core/config'

import { staffNavSections } from './staffNavigation'

export interface StaffSidebarProps {
  role: UserRole
}

export const StaffSidebar = ({ role }: StaffSidebarProps) => {
  const granted = permissionsFor(role)

  return (
    <aside className="staff-shell__sidebar">
      <NavLink className="staff-shell__brand" to={routePaths.staff.dashboard}>
        <div className="staff-shell__brand-logo-box">
          <img src="/logo.png" alt="TaxEdge" className="staff-shell__brand-logo-img" />
        </div>
        <div className="staff-shell__brand-text">
          <span className="staff-shell__brand-name">
            TAX<span className="staff-shell__brand-name-accent">EDGE</span>
          </span>
          <span className="staff-shell__brand-tag">Staff Portal</span>
        </div>
      </NavLink>

      <nav className="staff-shell__nav">
        {staffNavSections.map((section) => {
          const items = section.items.filter((item) => granted.includes(item.permission))
          if (items.length === 0) return null

          return (
            <div className="staff-shell__nav-section" key={section.title}>
              <p className="staff-shell__nav-title">{section.title}</p>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `staff-shell__nav-link${isActive ? ' is-active' : ''}`}
                >
                  <span className="staff-shell__nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
