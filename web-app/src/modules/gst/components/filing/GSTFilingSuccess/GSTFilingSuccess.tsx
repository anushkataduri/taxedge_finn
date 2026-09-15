import { formatCurrency } from '@shared/utils'
import type { PaymentResult } from '../../GSTStepPayment/GSTStepPayment'
import './GSTFilingSuccess.css'

interface GSTFilingSuccessProps {
  details: PaymentResult
  onViewReceipt: () => void
  onTrackApplication: () => void
  onBackToDashboard: () => void
}

export const GSTFilingSuccess = ({
  details,
  onViewReceipt,
  onTrackApplication,
  onBackToDashboard,
}: GSTFilingSuccessProps) => {
  return (
    <div className="gst-success-wrapper">
      <div className="gst-success-card">
        <div className="gst-success-ring">
          <svg viewBox="0 0 24 24" className="gst-success-check-svg">
            <path d="M20 6.5 9.5 17.5 4 12" />
          </svg>
        </div>

        <h1 className="gst-success-title">Payment successful</h1>
        <p className="gst-success-subtitle">
          {formatCurrency(details.amount)} received. Your GST Filing application is now active and Rohit Kulkarni has been notified.
        </p>

        <div className="gst-success-action-buttons">
          <button type="button" className="gst-success-btn-primary" onClick={onViewReceipt}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-success-btn-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download receipt
          </button>
          <button type="button" className="gst-success-btn-secondary" onClick={onTrackApplication}>
            Track application
          </button>
        </div>

        <div className="gst-success-details-table">
          <div className="gst-success-row">
            <span className="gst-success-label">Transaction ID</span>
            <span className="gst-success-value">{details.transactionId}</span>
          </div>
          <div className="gst-success-row">
            <span className="gst-success-label">Receipt number</span>
            <span className="gst-success-value">{details.receiptNumber}</span>
          </div>
          <div className="gst-success-row">
            <span className="gst-success-label">Method</span>
            <span className="gst-success-value">{details.method}</span>
          </div>
          <div className="gst-success-row">
            <span className="gst-success-label">Date</span>
            <span className="gst-success-value">{details.dateText}</span>
          </div>
          <div className="gst-success-row">
            <span className="gst-success-label">Application</span>
            <span className="gst-success-value">{details.applicationRef}</span>
          </div>
          <div className="gst-success-row gst-success-row--total">
            <span className="gst-success-total-label">Amount paid</span>
            <span className="gst-success-total-val">{formatCurrency(details.amount)}</span>
          </div>
        </div>
      </div>

      <button type="button" className="gst-success-btn-back-dash" onClick={onBackToDashboard}>
        Back to dashboard
      </button>
    </div>
  )
}

export default GSTFilingSuccess
