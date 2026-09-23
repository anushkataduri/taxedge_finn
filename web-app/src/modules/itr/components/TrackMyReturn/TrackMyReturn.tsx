import { useState } from 'react'
import {
  MOCK_TRACK_RETURNS,
  type ReturnTrackDetails,
} from './TrackMyReturn'
import { AlertTriangleIcon } from '../ItrIcons'
import './TrackMyReturn.css'

export interface TrackMyReturnProps {
  initialAck?: string
}

export const TrackMyReturn = ({ initialAck = 'ITR-2026-00074' }: TrackMyReturnProps) => {
  const [searchQuery, setSearchQuery] = useState(initialAck)
  const [activeDetails, setActiveDetails] = useState<ReturnTrackDetails>(
    MOCK_TRACK_RETURNS[initialAck] || MOCK_TRACK_RETURNS['ITR-2026-00074'],
  )
  const [errorMessage, setErrorMessage] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const sanitized = searchQuery.trim().toUpperCase()
    
    // Using functional lookup
    const found = Object.keys(MOCK_TRACK_RETURNS)
      .filter((key) => key.toUpperCase() === sanitized)
      .map((key) => MOCK_TRACK_RETURNS[key])[0]

    if (found) {
      setActiveDetails(found)
      setErrorMessage('')
    } else {
      setErrorMessage(`No return record found for acknowledgment "${searchQuery}". Try "ITR-2026-00074" or "ITR-2025-00611".`)
    }
  }

  return (
    <div className="track-return-container">
      <div className="track-return-header">
        <div className="track-return-header__badge">
          <span>⚡ Live ITD & CPC Tracker</span>
        </div>
        <h1 className="track-return-header__title">Track Income Tax Return & Refund</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', maxWidth: '650px' }}>
          Real-time integration with Income Tax Department e-filing portal & CPC Bengaluru.
        </p>

        <form onSubmit={handleSearch} className="track-return-search-bar">
          <input
            type="text"
            className="track-return-input"
            placeholder="Enter Acknowledgment Number (e.g. ITR-2026-00074)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <button type="submit" className="track-return-btn">
            Track Status
          </button>
        </form>
      </div>

      {errorMessage && (
        <div
          style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            color: '#c2410c',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertTriangleIcon size={18} strokeWidth={2} />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeDetails && (
        <div className="track-return-content">
          <div className="track-summary-card">
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem' }}>
              Return Summary
            </h3>
            
            <div className="track-summary-row">
              <span className="track-summary-label">Acknowledgment No</span>
              <span className="track-summary-val" style={{ color: '#1e3a8a' }}>
                {activeDetails.ackNumber}
              </span>
            </div>

            <div className="track-summary-row">
              <span className="track-summary-label">PAN Reference</span>
              <span className="track-summary-val">{activeDetails.pan}</span>
            </div>

            <div className="track-summary-row">
              <span className="track-summary-label">Assessment Year</span>
              <span className="track-summary-val">{activeDetails.assessmentYear}</span>
            </div>

            <div className="track-summary-row">
              <span className="track-summary-label">Form Type</span>
              <span className="track-summary-val">{activeDetails.formType}</span>
            </div>

            <div className="track-summary-row">
              <span className="track-summary-label">Expected Refund</span>
              <span className="track-summary-val" style={{ color: '#059669', fontSize: '1.05rem' }}>
                ₹{activeDetails.expectedRefund.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="track-summary-row">
              <span className="track-summary-label">Allocated CA</span>
              <span className="track-summary-val">{activeDetails.caAssigned}</span>
            </div>

            <div className="track-summary-row">
              <span className="track-summary-label">Validated Bank A/C</span>
              <span className="track-summary-val">•••• •••• {activeDetails.bankAccountLast4}</span>
            </div>
          </div>

          <div className="track-timeline-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem' }}>
                Filing & CPC Timeline
              </h3>
              <span
                style={{
                  background: '#ffedd5',
                  color: '#ea580c',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {activeDetails.refundStatus}
              </span>
            </div>

            <div className="track-timeline">
              {activeDetails.milestones.map((milestone) => (
                <div
                  key={milestone.stepNumber}
                  className={`track-milestone track-milestone--${milestone.status}`}
                >
                  <div className="track-milestone-dot">
                    {milestone.status === 'completed' ? '✓' : milestone.stepNumber}
                  </div>
                  <div className="track-milestone-body">
                    <h4 className="track-milestone-title">{milestone.title}</h4>
                    <p className="track-milestone-desc">{milestone.description}</p>
                    <span className="track-milestone-date">{milestone.dateLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackMyReturn
