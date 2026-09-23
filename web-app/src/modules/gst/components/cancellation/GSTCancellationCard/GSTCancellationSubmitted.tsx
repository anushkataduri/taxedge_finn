import React from 'react'
import './GSTCancellationSubmitted.css'

export interface GSTCancellationSubmittedProps {
  applicationId?: string; serviceName?: string; gstin: string; fieldsCount?: number
  onBackToForm: () => void; onAllForms: () => void
}

export const GSTCancellationSubmitted: React.FC<GSTCancellationSubmittedProps> = ({
  applicationId = 'GST-2026-00133', serviceName = 'GST Cancellation', gstin, fieldsCount = 7, onBackToForm, onAllForms,
}) => (
  <div className="gst-cancellation-submitted-wrapper">
    <div className="cancellation-submitted-card">
      <div className="cancellation-submitted-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="cancellation-submitted-title">GST Cancellation submitted</h1>
      <p className="cancellation-submitted-subtitle">Your request has been received and assigned to a GST executive.</p>

      <div className="cancellation-submitted-actions">
        <button type="button" className="cancellation-submitted-btn-primary" onClick={onBackToForm}>Back to the form</button>
        <button type="button" className="cancellation-submitted-btn-secondary" onClick={onAllForms}>All forms</button>
      </div>

      <div className="cancellation-submitted-divider" />

      <div className="cancellation-submitted-details">
        <div className="cancellation-submitted-row"><span className="cancellation-detail-label">Application ID</span><span className="cancellation-detail-value">{applicationId}</span></div>
        <div className="cancellation-submitted-row"><span className="cancellation-detail-label">Service</span><span className="cancellation-detail-value">{serviceName}</span></div>
        <div className="cancellation-submitted-row"><span className="cancellation-detail-label">GSTIN</span><span className="cancellation-detail-value">{gstin}</span></div>
        <div className="cancellation-submitted-row"><span className="cancellation-detail-label">Fields captured</span><span className="cancellation-detail-value">{fieldsCount}</span></div>
        <div className="cancellation-submitted-row">
          <span className="cancellation-detail-label">Status</span>
          <span className="cancellation-detail-value cancellation-status-new"><span className="cancellation-status-dot" aria-hidden="true">●</span> New Request</span>
        </div>
      </div>
    </div>
  </div>
)

export default GSTCancellationSubmitted
