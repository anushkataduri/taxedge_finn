import React from 'react'
import './GSTComplianceSubmitted.css'

export interface GSTComplianceSubmittedProps {
  applicationId?: string; serviceName?: string; gstin: string
  requestType: 'Reconciliation Support' | 'Notice Response'; fieldsCount?: number
  onBackToForm: () => void; onAllForms: () => void
}

export const GSTComplianceSubmitted: React.FC<GSTComplianceSubmittedProps> = ({
  applicationId = 'GST-2026-00132', serviceName = 'GST Compliance', gstin,
  requestType, fieldsCount, onBackToForm, onAllForms,
}) => (
  <div className="gst-compliance-submitted-wrapper">
    <div className="compliance-submitted-card">
      <div className="compliance-submitted-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="compliance-submitted-title">GST Compliance submitted</h1>
      <p className="compliance-submitted-subtitle">Your request has been received and assigned to a GST executive.</p>

      <div className="compliance-submitted-actions">
        <button type="button" className="compliance-submitted-btn-primary" onClick={onBackToForm}>Back to the form</button>
        <button type="button" className="compliance-submitted-btn-secondary" onClick={onAllForms}>All forms</button>
      </div>

      <div className="compliance-submitted-divider" />

      <div className="compliance-submitted-details">
        <div className="compliance-submitted-row"><span className="compliance-detail-label">Application ID</span><span className="compliance-detail-value">{applicationId}</span></div>
        <div className="compliance-submitted-row"><span className="compliance-detail-label">Service</span><span className="compliance-detail-value">{serviceName}</span></div>
        <div className="compliance-submitted-row"><span className="compliance-detail-label">GSTIN</span><span className="compliance-detail-value">{gstin}</span></div>
        <div className="compliance-submitted-row"><span className="compliance-detail-label">Fields captured</span><span className="compliance-detail-value">{fieldsCount ?? (requestType === 'Reconciliation Support' ? 7 : 10)}</span></div>
        <div className="compliance-submitted-row">
          <span className="compliance-detail-label">Status</span>
          <span className="compliance-detail-value compliance-status-new"><span className="compliance-status-dot" aria-hidden="true">●</span> New Request</span>
        </div>
      </div>
    </div>
  </div>
)

export default GSTComplianceSubmitted
