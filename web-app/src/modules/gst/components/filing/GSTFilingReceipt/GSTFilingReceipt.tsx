import { formatCurrency } from '@shared/utils'
import type { PaymentResult } from '../../GSTStepPayment/GSTStepPayment'
import { useAppStore } from '@store/index'
import './GSTFilingReceipt.css'

interface GSTFilingReceiptProps {
  details: PaymentResult
  onBack: () => void
}

export const GSTFilingReceipt = ({ details, onBack }: GSTFilingReceiptProps) => {
  const pushToast = useAppStore((state) => state.pushToast)

  const handleDownload = () => {
    pushToast('Receipt downloaded as PDF', 'success')
  }

  const handleEmail = () => {
    pushToast('Receipt emailed to anjali@shreedeshmukh.in', 'info')
  }

  const baseFee = Math.round(details.amount / 1.18)
  const cgst = Math.round(baseFee * 0.09)
  const sgst = details.amount - baseFee - cgst

  return (
    <div className="gst-receipt-wrapper">
      {/* Top Action Buttons */}
      <div className="gst-receipt-top-bar">
        <button type="button" className="gst-receipt-btn-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-receipt-icon-sm">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
        <div className="gst-receipt-top-actions">
          <button type="button" className="gst-receipt-btn-secondary" onClick={handleEmail}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-receipt-icon-sm">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email
          </button>
          <button type="button" className="gst-receipt-btn-primary" onClick={handleDownload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-receipt-icon-sm">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="gst-receipt-card">
        {/* Header with Navy Brand Gradient */}
        <div className="gst-receipt-card__header">
          <div className="gst-receipt-brand-row">
            <div className="gst-receipt-brand-left">
              <div className="gst-receipt-brand-mark">TE</div>
              <div>
                <h2 className="gst-receipt-brand-name">TaxEdge Fin Solutions</h2>
                <p className="gst-receipt-brand-gstin">GSTIN 27AAKCT9182F1ZR · Pune, Maharashtra</p>
              </div>
            </div>
            <div className="gst-receipt-brand-right">
              <span className="gst-receipt-type-tag">TAX INVOICE</span>
              <span className="gst-receipt-inv-num">{details.receiptNumber}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="gst-receipt-card__body">
          {/* Metadata Columns */}
          <div className="gst-receipt-meta-grid">
            <div className="gst-receipt-meta-col">
              <span className="gst-receipt-eyebrow">Billed to</span>
              <h4 className="gst-receipt-customer-name">Anjali Deshmukh</h4>
              <p className="gst-receipt-customer-addr">
                Shree Deshmukh Traders<br />
                Shop 14, Laxmi Complex, FC Road<br />
                Pune, Maharashtra 411004
              </p>
              <p className="gst-receipt-customer-gstin">GSTIN 27AXTPD4419K1ZP</p>
            </div>

            <div className="gst-receipt-meta-col gst-receipt-meta-col--right">
              <span className="gst-receipt-eyebrow">Invoice details</span>
              <div className="gst-receipt-info-row">
                <span className="gst-receipt-info-k">Date:</span>
                <span className="gst-receipt-info-v">2 Sep 2026</span>
              </div>
              <div className="gst-receipt-info-row">
                <span className="gst-receipt-info-k">Customer ID:</span>
                <span className="gst-receipt-info-v">TE-CUS-20418</span>
              </div>
              <div className="gst-receipt-info-row">
                <span className="gst-receipt-info-k">Application:</span>
                <span className="gst-receipt-info-v">{details.applicationRef}</span>
              </div>
              <div className="gst-receipt-info-row">
                <span className="gst-receipt-info-k">Place of supply:</span>
                <span className="gst-receipt-info-v">Maharashtra (27)</span>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="gst-receipt-perforated-line" />

          {/* Items Table */}
          <table className="gst-receipt-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>SAC</th>
                <th className="gst-receipt-num">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>GST Return Filing — August 2026</b>
                  <div className="gst-receipt-item-desc">Professional fee for preparation and filing of GSTR-1 &amp; GSTR-3B</div>
                </td>
                <td className="gst-receipt-sac">998231</td>
                <td className="gst-receipt-num"><b>{formatCurrency(baseFee)}</b></td>
              </tr>
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div className="gst-receipt-totals-box">
            <div className="gst-receipt-totals-row">
              <span className="gst-receipt-totals-k">Taxable value</span>
              <span className="gst-receipt-totals-v">{formatCurrency(baseFee)}</span>
            </div>
            <div className="gst-receipt-totals-row">
              <span className="gst-receipt-totals-k">CGST @ 9%</span>
              <span className="gst-receipt-totals-v">{formatCurrency(cgst)}</span>
            </div>
            <div className="gst-receipt-totals-row">
              <span className="gst-receipt-totals-k">SGST @ 9%</span>
              <span className="gst-receipt-totals-v">{formatCurrency(sgst)}</span>
            </div>
            <div className="gst-receipt-totals-row gst-receipt-totals-row--grand">
              <span className="gst-receipt-totals-grand-k">Total paid</span>
              <span className="gst-receipt-totals-grand-v">{formatCurrency(details.amount)}</span>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="gst-receipt-perforated-line" />

          {/* Payment Info */}
          <div className="gst-receipt-payment-footer">
            <div>
              <span className="gst-receipt-eyebrow">Payment details</span>
              <div className="gst-receipt-pay-method">{details.method}</div>
              <div className="gst-receipt-pay-txn">{details.transactionId}</div>
            </div>
            <span className="gst-receipt-paid-badge">
              <span className="gst-receipt-badge-dot" /> Paid in full
            </span>
          </div>

          <p className="gst-receipt-legal-note">
            This is a computer-generated invoice and does not require a signature.<br />
            Amount in words: Two thousand nine hundred fifty rupees only.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GSTFilingReceipt
