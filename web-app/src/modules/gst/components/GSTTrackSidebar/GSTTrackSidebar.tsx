import './GSTTrackSidebar.css'

interface GSTTrackSidebarProps {
  assignee?: {
    name: string
    role: string
    initials: string
  }
  openedDate: string
  dueDate: string
  documentsCount: string
  fee: string
  paymentStatus: string
  onMessageExecutive: () => void
  onDownloadReceipt: () => void
}

export const GSTTrackSidebar = ({
  assignee = {
    name: 'Rohit Kulkarni',
    role: 'GST Executive',
    initials: 'RK',
  },
  openedDate,
  dueDate,
  documentsCount,
  fee,
  paymentStatus,
  onMessageExecutive,
  onDownloadReceipt,
}: GSTTrackSidebarProps) => {
  return (
    <div className="gst-track-sidebar">
      {/* Assigned To Card */}
      <div className="gst-track-sidebar__card">
        <h3 className="gst-track-sidebar__title">Assigned to</h3>

        <div className="gst-track-sidebar__assignee-row">
          <div className="gst-track-sidebar__avatar">{assignee.initials}</div>
          <div className="gst-track-sidebar__assignee-meta">
            <span className="gst-track-sidebar__assignee-name">{assignee.name}</span>
            <span className="gst-track-sidebar__assignee-role">{assignee.role}</span>
          </div>
        </div>

        <button
          type="button"
          className="gst-track-sidebar__btn-msg"
          onClick={onMessageExecutive}
          aria-label="Message executive"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="gst-track-sidebar__msg-icon"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Message executive
        </button>
      </div>

      {/* Details Card */}
      <div className="gst-track-sidebar__card">
        <h3 className="gst-track-sidebar__title">Details</h3>

        <div className="gst-track-sidebar__table">
          <div className="gst-track-sidebar__row">
            <span className="gst-track-sidebar__label">Opened</span>
            <span className="gst-track-sidebar__value">{openedDate}</span>
          </div>

          <div className="gst-track-sidebar__row">
            <span className="gst-track-sidebar__label">Due date</span>
            <span className="gst-track-sidebar__value">{dueDate}</span>
          </div>

          <div className="gst-track-sidebar__row">
            <span className="gst-track-sidebar__label">Documents</span>
            <span className="gst-track-sidebar__value">{documentsCount}</span>
          </div>

          <div className="gst-track-sidebar__row">
            <span className="gst-track-sidebar__label">Fee</span>
            <span className="gst-track-sidebar__value">{fee}</span>
          </div>

          <div className="gst-track-sidebar__row">
            <span className="gst-track-sidebar__label">Payment</span>
            <span className="gst-track-sidebar__value gst-track-sidebar__value--paid">
              {paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Download Receipt Button */}
      <button
        type="button"
        className="gst-track-sidebar__btn-receipt"
        onClick={onDownloadReceipt}
        aria-label="Download receipt"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="gst-track-sidebar__receipt-icon"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download receipt
      </button>
    </div>
  )
}
