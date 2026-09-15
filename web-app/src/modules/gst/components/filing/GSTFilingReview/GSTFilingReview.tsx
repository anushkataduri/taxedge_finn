import { useState } from 'react'
import { formatCurrency } from '@shared/utils'
import './GSTFilingReview.css'

interface GSTFilingReviewProps {
  selectedMonth?: string
  baseFee?: number
  onBack: () => void
  onRequestChange?: () => void
  onApprove: () => void
}

export const GSTFilingReview = ({
  selectedMonth = 'August 2026',
  baseFee = 2500,
  onBack,
  onRequestChange,
  onApprove,
}: GSTFilingReviewProps) => {
  const [agreed, setAgreed] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const gstAmount = Math.round(baseFee * 0.18)
  const totalPayable = baseFee + gstAmount

  const handleApproveClick = () => {
    if (!agreed) {
      setError('Please check the declaration box to authorize TaxEdge to file your GST return.')
      return
    }
    setError(null)
    onApprove()
  }

  const outwardSupplies = [
    { desc: 'B2B supplies', taxable: 1284000, cgst: 115560, sgst: 115560, igst: 0 },
    { desc: 'B2C (large)', taxable: 312500, cgst: 28125, sgst: 28125, igst: 0 },
    { desc: 'B2C (small)', taxable: 246000, cgst: 22140, sgst: 22140, igst: 0 },
    { desc: 'Credit notes', taxable: -24800, cgst: -2232, sgst: -2232, igst: 0 },
  ]

  const totalTaxable = 1817700
  const totalCGST = 163593
  const totalSGST = 163593
  const totalIGST = 0

  return (
    <div className="gst-review-wrapper">
      <header className="gst-review-header">
        <div className="gst-review-header__left">
          <h1 className="gst-review-header__title">Review your return</h1>
          <p className="gst-review-header__subtitle">Prepared by Rohit Kulkarni on 1 September 2026. Approve it and we file the same day.</p>
        </div>
        <span className="gst-review-header__badge">
          <span className="gst-review-badge-dot" /> Awaiting your approval
        </span>
      </header>

      <div className="gst-review-layout">
        <main className="gst-review-main">
          {/* Outward supplies — GSTR-1 */}
          <section className="gst-review-card">
            <h2 className="gst-review-card__title">Outward supplies — GSTR-1</h2>
            <div className="gst-review-table-wrap">
              <table className="gst-review-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Taxable value</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                  </tr>
                </thead>
                <tbody>
                  {outwardSupplies.map((row, idx) => (
                    <tr key={idx}>
                      <td><b>{row.desc}</b></td>
                      <td className="gst-review-num">{formatCurrency(row.taxable)}</td>
                      <td className="gst-review-num">{formatCurrency(row.cgst)}</td>
                      <td className="gst-review-num">{formatCurrency(row.sgst)}</td>
                      <td className="gst-review-num">{formatCurrency(row.igst)}</td>
                    </tr>
                  ))}
                  <tr className="gst-review-table__total-row">
                    <td><b>Total</b></td>
                    <td className="gst-review-num"><b>{formatCurrency(totalTaxable)}</b></td>
                    <td className="gst-review-num"><b>{formatCurrency(totalCGST)}</b></td>
                    <td className="gst-review-num"><b>{formatCurrency(totalSGST)}</b></td>
                    <td className="gst-review-num"><b>{formatCurrency(totalIGST)}</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Summary — GSTR-3B */}
          <section className="gst-review-card">
            <h2 className="gst-review-card__title">Summary — GSTR-3B</h2>
            <div className="gst-review-summary-rows">
              <div className="gst-review-srow">
                <span className="gst-review-srow__k">Output tax liability</span>
                <span className="gst-review-srow__v">{formatCurrency(327186)}</span>
              </div>
              <div className="gst-review-srow">
                <span className="gst-review-srow__k">Input tax credit available</span>
                <span className="gst-review-srow__v">{formatCurrency(196400)}</span>
              </div>
              <div className="gst-review-srow">
                <span className="gst-review-srow__k">ITC reversed</span>
                <span className="gst-review-srow__v">{formatCurrency(4200)}</span>
              </div>
              <div className="gst-review-srow">
                <span className="gst-review-srow__k">Cash ledger balance</span>
                <span className="gst-review-srow__v">{formatCurrency(18000)}</span>
              </div>
              <div className="gst-review-srow gst-review-srow--highlight">
                <span className="gst-review-srow__k-bold">Net tax payable in cash</span>
                <span className="gst-review-srow__v-bold">{formatCurrency(116986)}</span>
              </div>
            </div>
          </section>

          {/* Declaration Card */}
          <section className="gst-review-card">
            <h3 className="gst-review-declaration__title">Your approval</h3>
            <label className="gst-review-checkbox-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked)
                  if (e.target.checked) setError(null)
                }}
                className="gst-review-checkbox"
              />
              <span>
                I have reviewed the figures above and confirm they reflect my books for {selectedMonth}. I authorise TaxEdge to file GSTR-1 and GSTR-3B on my behalf.
              </span>
            </label>
            {error && (
              <p style={{ margin: '0.75rem 0 0 0', color: '#b91c1c', fontSize: '0.84rem', fontWeight: 600 }}>
                ⚠️ {error}
              </p>
            )}
          </section>

          {/* Actions */}
          <div className="gst-review-actions">
            <button
              type="button"
              className="gst-review-btn-ghost"
              onClick={onRequestChange || onBack}
            >
              Request a change
            </button>
            <button
              type="button"
              className="gst-review-btn-continue"
              onClick={handleApproveClick}
            >
              Approve &amp; pay →
            </button>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="gst-review-sidebar">
          {/* Order Summary Card */}
          <div className="gst-review-order-card">
            <h3 className="gst-review-order-card__title">Order summary</h3>
            <div className="gst-review-order-card__table">
              <div className="gst-review-order-card__row">
                <span className="gst-review-order-card__label">GST Filing — {selectedMonth.split(' ')[0].substring(0, 3)} {selectedMonth.split(' ')[1]}</span>
                <span className="gst-review-order-card__value">{formatCurrency(baseFee)}</span>
              </div>
              <div className="gst-review-order-card__row">
                <span className="gst-review-order-card__label">GST @ 18%</span>
                <span className="gst-review-order-card__value">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="gst-review-order-card__divider" />
              <div className="gst-review-order-card__row gst-review-order-card__row--total">
                <span className="gst-review-order-card__total-label">Total payable</span>
                <span className="gst-review-order-card__total-amount">{formatCurrency(totalPayable)}</span>
              </div>
            </div>
            <div className="gst-review-order-card__delivery">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-review-clock-icon">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Filed within 1 working day</span>
            </div>
          </div>

          <div className="gst-review-note">
            <div className="gst-review-note__icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="gst-review-note__content">
              <h4 className="gst-review-note__title">Tax payable is separate</h4>
              <p className="gst-review-note__desc">
                {formatCurrency(116986)} of GST must be paid to the department from your cash ledger. The fee above is only the TaxEdge professional fee.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default GSTFilingReview
