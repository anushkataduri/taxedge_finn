import './ReceiptActions.css'

interface ReceiptActionsProps {
  onBack: () => void
  onEmail: () => void
  onDownloadPdf: () => void
}

export const ReceiptActions = ({
  onBack,
  onEmail,
  onDownloadPdf,
}: ReceiptActionsProps) => {
  return (
    <div className="receipt-actions-bar">
      <button
        type="button"
        className="receipt-actions-bar__btn receipt-actions-bar__btn--back"
        onClick={onBack}
        aria-label="Go back"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="receipt-actions-bar__icon"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="receipt-actions-bar__right-group">
        <button
          type="button"
          className="receipt-actions-bar__btn receipt-actions-bar__btn--secondary"
          onClick={onEmail}
          aria-label="Email receipt"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="receipt-actions-bar__icon"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Email
        </button>

        <button
          type="button"
          className="receipt-actions-bar__btn receipt-actions-bar__btn--primary"
          onClick={onDownloadPdf}
          aria-label="Download receipt as PDF"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="receipt-actions-bar__icon"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  )
}
