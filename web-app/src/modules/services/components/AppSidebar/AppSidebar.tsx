import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAuthStore } from '@store/index'
import './AppSidebar.css'

export interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface SidebarNavItem {
  id: string
  label: string
  to: string
  icon: ReactNode
  badge?: string
}

interface SidebarNavSection {
  title: string
  items: SidebarNavItem[]
}

const SIDEBAR_SECTIONS: SidebarNavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: routePaths.dashboard,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        ),
      },
      {
        id: 'all-services',
        label: 'All Services',
        to: '/services',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Services',
    items: [
      {
        id: 'gst',
        label: 'GST',
        to: routePaths.gst.root,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        id: 'itr-tds',
        label: 'ITR & TDS',
        to: routePaths.itr.root,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        id: 'loans',
        label: 'Loans',
        to: routePaths.loans,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        ),
      },
      {
        id: 'business-commercial',
        label: 'Business & Commercial',
        to: routePaths.applications,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
          </svg>
        ),
      },
      {
        id: 'insurance',
        label: 'Insurance',
        to: routePaths.insurance,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'My Account',
    items: [
      {
        id: 'applications',
        label: 'Applications',
        to: routePaths.applications,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        ),
      },
      {
        id: 'document-vault',
        label: 'Document Vault',
        to: routePaths.documents,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
    ],
  },
]

export const AppSidebar = ({ isOpen = false, onClose }: AppSidebarProps) => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)

  const userName = user?.fullName || 'SaaS Client'
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <>
      <div
        className={`app-sidebar-overlay${isOpen ? ' app-sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar${isOpen ? ' app-sidebar--open' : ''}`} aria-label="TaxEdge Dashboard Sidebar">
        {/* 1. Header / Logo */}
        <Link to={routePaths.dashboard} className="app-sidebar__header" onClick={onClose}>
          <div className="app-sidebar__logo-box">
            <img src="/logo-dark.png" alt="TaxEdge" className="app-sidebar__logo-img" />
          </div>
          <div className="app-sidebar__brand-text">
            <span className="app-sidebar__brand-name">
              TAX<span className="app-sidebar__brand-name-accent">EDGE</span>
            </span>
            <span className="app-sidebar__brand-sub">FIN SOLUTIONS</span>
          </div>
        </Link>

        {/* 2. Grouped Nav Items */}
        <nav className="app-sidebar__nav">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="app-sidebar__section">
              <h4 className="app-sidebar__section-title">{section.title}</h4>
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.to === '/services' && location.pathname.startsWith('/services')) ||
                  (item.to === '/services' && location.pathname.startsWith('/all-services'))

                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`app-sidebar__item${isActive ? ' app-sidebar__item--active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && <span className="app-sidebar__item-badge">{item.badge}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* 3. User Profile Footer */}
        <div className="app-sidebar__footer">
          <div className="app-sidebar__user">
            <div className="app-sidebar__avatar">{userInitials}</div>
            <div className="app-sidebar__user-info">
              <span className="app-sidebar__user-name">{userName}</span>
              <span className="app-sidebar__user-role">Customer Account</span>
            </div>
          </div>

          <button
            type="button"
            className="app-sidebar__signout-btn"
            onClick={() => {
              if (onClose) onClose()
              signOut()
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
