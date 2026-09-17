import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import './GSTAmendmentSubmitted.css'

interface GSTAmendmentSubmittedProps {
  applicationId?: string
  serviceName?: string
  gstin?: string
  fieldsCaptured?: number
  status?: string
  onBackToForm: () => void
  onAllForms?: () => void
}

export const GSTAmendmentSubmitted = ({
  applicationId = 'GST-2026-00134',
  serviceName = 'GST Amendment',
  gstin = '27AXTPD4419K1ZP',
  fieldsCaptured = 5,
  status = 'New Request',
  onBackToForm,
  onAllForms,
}: GSTAmendmentSubmittedProps) => {
  return (
    <div className="gst-submitted-page">
      {/* Top Breadcrumb & Metadata Row matching screenshot */}
      <header className="gst-submitted-header">
        <nav className="gst-submitted-breadcrumbs" aria-label="Breadcrumb">
          <Link
            to={routePaths.gst.root}
            onClick={onAllForms}
            className="gst-submitted-breadcrumb__link"
          >
            GST Form Screens
          </Link>
          <span className="gst-submitted-breadcrumb__separator">→</span>
          <button
            type="button"
            onClick={onBackToForm}
            className="gst-submitted-breadcrumb__btn-link"
          >
            GST Amendment
          </button>
          <span className="gst-submitted-breadcrumb__separator">→</span>
          <span className="gst-submitted-breadcrumb__current">Submitted</span>
        </nav>
      </header>

      {/* Main Submitted Card */}
      <main className="gst-submitted-card">
        {/* Top Checkmark Area */}
        <div className="gst-submitted-card__hero">
          <div className="gst-submitted-card__check-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="gst-submitted-card__title">GST Amendment submitted</h1>
          <p className="gst-submitted-card__subtitle">
            Your request has been received and assigned to a GST executive.
          </p>

          <div className="gst-submitted-card__actions">
            <button
              type="button"
              className="gst-submitted-btn gst-submitted-btn--primary"
              onClick={onBackToForm}
            >
              Back to the form
            </button>
            <Link
              to={routePaths.gst.root}
              onClick={onAllForms}
              className="gst-submitted-btn gst-submitted-btn--secondary"
            >
              All forms
            </Link>
          </div>
        </div>

        <div className="gst-submitted-divider" />

        {/* Details List */}
        <div className="gst-submitted-details">
          <div className="gst-submitted-row">
            <span className="gst-submitted-row__label">Application ID</span>
            <span className="gst-submitted-row__value">{applicationId}</span>
          </div>
          <div className="gst-submitted-row">
            <span className="gst-submitted-row__label">Service</span>
            <span className="gst-submitted-row__value">{serviceName}</span>
          </div>
          <div className="gst-submitted-row">
            <span className="gst-submitted-row__label">GSTIN</span>
            <span className="gst-submitted-row__value">{gstin}</span>
          </div>
          <div className="gst-submitted-row">
            <span className="gst-submitted-row__label">Fields captured</span>
            <span className="gst-submitted-row__value">{fieldsCaptured}</span>
          </div>
          <div className="gst-submitted-row">
            <span className="gst-submitted-row__label">Status</span>
            <span className="gst-submitted-row__value gst-submitted-row__value--status">
              {status}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
