import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { routePaths } from '@core/config'
import { initialsOf } from '@shared/utils'
import { useAuthStore } from '@store/index'
import { navSections } from './navigation'
import { useDashboardSummary } from '@modules/dashboard'
import './DashboardLayout.css'

const MenuIcon = () => (
  <svg className="shell__menu-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg className="shell__menu-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SearchIcon = () => (
  <svg className="shell__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const BellIcon = () => (
  <svg className="shell__action-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const ChatIcon = () => (
  <svg className="shell__action-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const GridIcon = () => (
  <svg className="shell__action-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const location = useLocation()
  const { data } = useDashboardSummary()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const currentNav = useMemo(() => {
    for (const section of navSections) {
      const match = section.items
        .filter((i) => !i.to.includes('#'))
        .filter((i) => location.pathname === i.to || location.pathname.startsWith(`${i.to}/`))
        .sort((a, b) => b.to.length - a.to.length)[0]
      if (match) {
        return { sectionTitle: section.title, label: match.label }
      }
    }
    return { sectionTitle: 'Overview', label: 'Dashboard' }
  }, [location.pathname])

  const badges: Partial<Record<'applications' | 'notifications', string>> = {
    applications: data?.brief ? String(data.brief.activeApplications) : undefined,
    notifications: '3',
  }

  const customerCode = user ? `TE-CUS-${user.id.slice(-5).toUpperCase()}` : ''

  return (
    <div className="shell">
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileNavOpen && (
        <div
          className="shell__backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Fixed on Desktop, Slide-over Drawer on Tablet/Mobile) */}
      <aside
        className={`shell__sidebar${isMobileNavOpen ? ' shell__sidebar--mobile-open' : ''}`}
        aria-label="TaxEdge Dashboard Sidebar"
      >
        <div className="shell__brand-row">
          <NavLink
            className="shell__brand"
            to={routePaths.dashboard}
            onClick={() => setIsMobileNavOpen(false)}
          >
            <div className="shell__brand-logo-box">
              <img src="/logo-dark.png" alt="TaxEdge" className="shell__brand-logo-img" />
            </div>
            <div className="shell__brand-text">
              <span className="shell__brand-name">TAX<span className="shell__brand-name-accent">EDGE</span></span>
              <span className="shell__brand-tag">FIN SOLUTIONS</span>
            </div>
          </NavLink>

          <button
            type="button"
            className="shell__sidebar-close"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close sidebar navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="shell__nav">
          {navSections.map((section) => (
            <div className="shell__nav-section" key={section.title}>
              <p className="shell__nav-title">{section.title}</p>
              {section.items.map((item) =>
                item.to.includes('#') ? (
                  <a
                    key={item.to}
                    href={item.to}
                    className="shell__nav-link"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <span className="shell__nav-icon" aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `shell__nav-link${isActive ? ' is-active' : ''}`}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <span className="shell__nav-icon" aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badgeKey && badges[item.badgeKey] && (
                      <span className="shell__nav-badge">{badges[item.badgeKey]}</span>
                    )}
                  </NavLink>
                ),
              )}
            </div>
          ))}
        </nav>

        <div className="shell__sidebar-footer">
          <div className="shell__user">
            <span className="shell__avatar" aria-hidden="true">
              {initialsOf(user?.fullName ?? 'TaxEdge User')}
            </span>
            <div className="shell__user-meta">
              <span className="shell__user-name">{user?.fullName ?? 'Guest'}</span>
              {user && <span className="shell__user-code">{customerCode}</span>}
            </div>
          </div>

          <button className="shell__signout" type="button" onClick={signOut}>
            <span aria-hidden="true">⇥</span> Sign out
          </button>
        </div>
      </aside>

      <div className="shell__main">
        <header className="shell__header">
          <div className="shell__header-left">
            <button
              type="button"
              className="shell__mobile-toggle"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <nav className="shell__breadcrumb" aria-label="Breadcrumb">
              {location.pathname === routePaths.gst.filing ||
              location.pathname === routePaths.gst.filePeriod ||
              location.pathname === routePaths.gst.fileUpload ||
              location.pathname === routePaths.gst.fileReview ||
              location.pathname === routePaths.gst.filePayment ||
              location.pathname === routePaths.gst.fileSuccess ||
              location.pathname === routePaths.gst.fileReceipt ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <Link to={routePaths.gst.filing}>Filing</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">
                    {location.pathname === routePaths.gst.fileUpload
                      ? 'Documents'
                      : location.pathname === routePaths.gst.fileReview
                        ? 'Review'
                        : location.pathname === routePaths.gst.filePayment
                          ? 'Payment'
                          : location.pathname === routePaths.gst.fileSuccess
                            ? 'Confirmation'
                            : location.pathname === routePaths.gst.fileReceipt
                              ? 'Receipt'
                              : 'Period'}
                  </span>
                </>
              ) : location.pathname === routePaths.gst.registration ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">Registration</span>
                </>
              ) : location.pathname === routePaths.gst.returns ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">Returns</span>
                </>
              ) : location.pathname.startsWith('/gst/') && location.pathname.endsWith('/track') ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">Track Application</span>
                </>
              ) : location.pathname === routePaths.gst.amendment ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">Amendment</span>
                </>
              ) : location.pathname === routePaths.gst.certificate ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">Certificate</span>
                </>
              ) : location.pathname === routePaths.gst.compliance ||
                location.pathname === routePaths.gst.complianceSubmitted ||
                (location.pathname.startsWith(routePaths.gst.compliance) && (location.search.includes('submitted') || location.pathname.includes('submitted'))) ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  {location.pathname === routePaths.gst.complianceSubmitted || location.search.includes('submitted') ? (
                    <>
                      <Link to={routePaths.gst.compliance}>Compliance</Link>
                      <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                      <span className="shell__breadcrumb-current">Submitted</span>
                    </>
                  ) : (
                    <span className="shell__breadcrumb-current">Compliance</span>
                  )}
                </>
              ) : location.pathname === routePaths.gst.cancellation ||
                location.pathname === routePaths.gst.cancellationSubmitted ||
                (location.pathname.startsWith(routePaths.gst.cancellation) && (location.search.includes('submitted') || location.pathname.includes('submitted'))) ? (
                <>
                  <Link to={routePaths.gst.root}>GST</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  {location.pathname === routePaths.gst.cancellationSubmitted || location.search.includes('submitted') ? (
                    <>
                      <Link to={routePaths.gst.cancellation}>Cancellation</Link>
                      <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                      <span className="shell__breadcrumb-current">Submitted</span>
                    </>
                  ) : (
                    <span className="shell__breadcrumb-current">Cancellation</span>
                  )}
                </>
              ) : location.pathname === routePaths.gst.root ? (
                <span className="shell__breadcrumb-current">GST</span>
              ) : location.pathname.startsWith('/itr/') ? (
                <>
                  <Link to={routePaths.itr.root}>ITR &amp; TDS</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">
                    {location.pathname === routePaths.itr.fileItr
                      ? 'File ITR'
                      : location.pathname === routePaths.itr.trackMyReturn
                        ? 'Track Return'
                        : location.pathname === routePaths.itr.itrFiling
                          ? 'ITR Filing'
                          : location.pathname === routePaths.itr.tdsRefund
                            ? 'TDS Refund'
                            : location.pathname === routePaths.itr.previousYearItr
                              ? 'Previous Year ITR'
                              : location.pathname === routePaths.itr.revisedItr
                                ? 'Revised ITR'
                                : location.pathname === routePaths.itr.taxNoticeAssistance
                                  ? 'Notice Assistance'
                                  : location.pathname === routePaths.itr.tdsRefundEstimator
                                    ? 'TDS Refund Estimator'
                                    : location.pathname === routePaths.itr.taxComputation
                                      ? 'Tax Computation'
                                      : 'Filing'}
                  </span>
                </>
              ) : location.pathname === routePaths.itr.root ? (
                <span className="shell__breadcrumb-current">ITR &amp; TDS</span>
              ) : currentNav.sectionTitle === 'Services' ? (
                <>
                  <Link to={routePaths.services}>Services</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">{currentNav.label}</span>
                </>
              ) : currentNav.label === 'Dashboard' ? (
                <span className="shell__breadcrumb-current">Dashboard</span>
              ) : (
                <>
                  <Link to={routePaths.dashboard}>Home</Link>
                  <span className="shell__breadcrumb-sep" aria-hidden="true">→</span>
                  <span className="shell__breadcrumb-current">{currentNav.label}</span>
                </>
              )}
            </nav>
          </div>

          <div className="shell__header-actions">
            <label className="shell__search">
              <SearchIcon />
              <input type="search" placeholder="Search applications, documents..." />
            </label>

            <button className="shell__icon-button" type="button" aria-label="Notifications" title="Notifications">
              <BellIcon />
              <span className="shell__icon-dot" aria-hidden="true" />
            </button>

            <NavLink className="shell__icon-button" to={routePaths.chat} aria-label="Chat with support" title="Messages">
              <ChatIcon />
            </NavLink>

            <NavLink className="shell__icon-button" to={routePaths.services} aria-label="All services" title="All Services">
              <GridIcon />
            </NavLink>
          </div>
        </header>

        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
