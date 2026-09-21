import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import './GSTCertificateSubmitted.css'

interface GSTCertificateSubmittedProps {
  applicationId?: string
  serviceName?: string
  gstin?: string
  fieldsCaptured?: number
  status?: string
  onBackToForm: () => void
  onAllForms?: () => void
}

export const GSTCertificateSubmitted = ({
  applicationId = 'GST-2026-00135',
  serviceName = 'GST Certificate',
  gstin = '27AXTPD4419K1ZP',
  fieldsCaptured = 3,
  status = 'New Request',
  onBackToForm,
  onAllForms,
}: GSTCertificateSubmittedProps) => {
  return (
    <div className="gst-cert-submitted-page">
      {/* Top Breadcrumb & Metadata Row */}
      <header className="gst-cert-submitted-header">
        <nav className="gst-cert-submitted-breadcrumbs" aria-label="Breadcrumb">
          <Link
            to={routePaths.gst.root}
            onClick={onAllForms}
            className="gst-cert-submitted-breadcrumb__link"
          >
            GST Form Screens
          </Link>
          <span className="gst-cert-submitted-breadcrumb__separator">→</span>
          <button
            type="button"
            onClick={onBackToForm}
            className="gst-cert-submitted-breadcrumb__btn-link"
          >
            GST Certificate
          </button>
          <span className="gst-cert-submitted-breadcrumb__separator">→</span>
          <span className="gst-cert-submitted-breadcrumb__current">Submitted</span>
        </nav>
      </header>

      {/* Main Submitted Card (60% width) */}
      <main className="gst-cert-submitted-card">
        {/* Top Checkmark Hero Area */}
        <div className="gst-cert-submitted-card__hero">
          <div className="gst-cert-submitted-card__check-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="gst-cert-submitted-card__title">GST Certificate submitted</h1>
          <p className="gst-cert-submitted-card__subtitle">
            Your request has been received and assigned to a GST executive.
          </p>

          <div className="gst-cert-submitted-card__actions">
            <button
              type="button"
              className="gst-cert-submitted-btn gst-cert-submitted-btn--primary"
              onClick={onBackToForm}
            >
              Back to the form
            </button>
            <Link
              to={routePaths.gst.root}
              onClick={onAllForms}
              className="gst-cert-submitted-btn gst-cert-submitted-btn--secondary"
            >
              All forms
            </Link>
          </div>
        </div>

        <div className="gst-cert-submitted-divider" />

        {/* Details List */}
        <div className="gst-cert-submitted-details">
          <div className="gst-cert-submitted-row">
            <span className="gst-cert-submitted-row__label">Application ID</span>
            <span className="gst-cert-submitted-row__value">{applicationId}</span>
          </div>
          <div className="gst-cert-submitted-row">
            <span className="gst-cert-submitted-row__label">Service</span>
            <span className="gst-cert-submitted-row__value">{serviceName}</span>
          </div>
          <div className="gst-cert-submitted-row">
            <span className="gst-cert-submitted-row__label">GSTIN</span>
            <span className="gst-cert-submitted-row__value">{gstin}</span>
          </div>
          <div className="gst-cert-submitted-row">
            <span className="gst-cert-submitted-row__label">Fields captured</span>
            <span className="gst-cert-submitted-row__value">{fieldsCaptured}</span>
          </div>
          <div className="gst-cert-submitted-row">
            <span className="gst-cert-submitted-row__label">Status</span>
            <span className="gst-cert-submitted-row__value gst-cert-submitted-row__value--status">
              {status}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
