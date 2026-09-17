import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import type { PaymentResult } from '../GSTStepPayment/GSTStepPayment'
import './GSTPaymentSuccess.css'

interface GSTPaymentSuccessProps {
  details: PaymentResult
  onBackToDashboard?: () => void
}

export const GSTPaymentSuccess = ({
  details,
  onBackToDashboard,
}: GSTPaymentSuccessProps) => {
  const navigate = useNavigate()

  const handleDownloadReceipt = () => {
    navigate(
      `${routePaths.paymentReceiptDirect}?id=${encodeURIComponent(
        details.applicationRef
      )}&receipt=${encodeURIComponent(details.receiptNumber)}&amount=${details.amount}`
    )
  }

  const handleTrackApplication = () => {
    navigate(routePaths.gst.track(details.applicationRef))
  }

  const handleDashboard = () => {
    if (onBackToDashboard) {
      onBackToDashboard()
    } else {
      navigate(routePaths.gst.root)
    }
  }

  const tableRows = [
    { label: 'Transaction ID', value: details.transactionId },
    { label: 'Receipt number', value: details.receiptNumber },
    { label: 'Method', value: details.method },
    { label: 'Date', value: details.dateText },
    { label: 'Application', value: details.applicationRef },
  ]

  return (
    <div className="gst-payment-success-wrapper">
      <div className="gst-payment-success-card">
        {/* Success Icon */}
        <div className="gst-success-icon-wrap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="gst-success-icon"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="gst-success-title">Payment successful</h1>
        <p className="gst-success-desc">
          ₹{details.amount.toLocaleString('en-IN')} received. Your GST Registration application
          is now active and Rohit Kulkarni has been notified.
        </p>

        {/* Primary Action Buttons */}
        <div className="gst-success-actions-row">
          <button
            type="button"
            className="gst-btn-download-receipt"
            onClick={handleDownloadReceipt}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gst-btn-receipt-icon"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download receipt
          </button>

          <button
            type="button"
            className="gst-btn-track-app"
            onClick={handleTrackApplication}
          >
            Track application
          </button>
        </div>

        {/* Details Table Card */}
        <div className="gst-success-details-card">
          <div className="gst-success-details-list">
            {tableRows.map((row) => (
              <div key={row.label} className="gst-success-detail-row">
                <span className="gst-success-detail-label">{row.label}</span>
                <span className="gst-success-detail-value">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="gst-success-total-row">
            <span className="gst-success-total-label">Amount paid</span>
            <span className="gst-success-total-val">
              ₹{details.amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="gst-btn-back-dashboard"
        onClick={handleDashboard}
      >
        Back to dashboard
      </button>
    </div>
  )
}
