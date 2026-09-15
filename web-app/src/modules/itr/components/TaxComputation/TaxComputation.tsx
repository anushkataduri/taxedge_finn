import { useState } from 'react'
import {
  MOCK_COMPUTATION_DATA,
  type FullComputationModel,
} from './TaxComputation'
import { BarChartIcon } from '../ItrIcons'
import './TaxComputation.css'

export interface TaxComputationProps {
  onApprove?: () => void
}

export const TaxComputation = ({ onApprove }: TaxComputationProps) => {
  const [data] = useState<FullComputationModel>(MOCK_COMPUTATION_DATA)
  const [isApproved, setIsApproved] = useState(false)

  const handleApprove = () => {
    setIsApproved(true)
    if (onApprove) {
      onApprove()
    }
  }

  return (
    <div className="tax-comp-container">
      <div className="tax-comp-hero">
        <div className="tax-comp-hero__badge">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <BarChartIcon size={14} strokeWidth={2.2} /> Reconciled CA Computation
          </span>
          <span>•</span>
          <span>AIS & TIS Matched</span>
        </div>
        <h1 className="tax-comp-hero__title">Tax Computation & AIS Reconciliation</h1>
        <p className="tax-comp-hero__subtitle">
          View your audited computation statement prepared by CA Meera Iyer before final electronic
          filing with the Income Tax Department.
        </p>
      </div>

      <div className="tax-comp-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem' }}>
              Statement of Total Income — {data.assessmentYear}
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              PAN: {data.pan} · Assessee: {data.taxpayerName} · Status: {data.filingStatus}
            </span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#1e40af',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            🖨️ Print / Download PDF
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tax-comp-table">
            <thead>
              <tr>
                <th>Head of Income</th>
                <th>Gross (₹)</th>
                <th>Exemptions / Deductions (₹)</th>
                <th>Net Taxable (₹)</th>
                <th>AIS Verification</th>
              </tr>
            </thead>
            <tbody>
              {data.heads.map((head, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{head.headName}</strong>
                  </td>
                  <td>₹{head.grossAmount.toLocaleString('en-IN')}</td>
                  <td>₹{head.exemptions.toLocaleString('en-IN')}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    ₹{head.netTaxable.toLocaleString('en-IN')}
                  </td>
                  <td>
                    {head.aisVerified && (
                      <span className="tax-comp-ais-badge">
                        ✓ AIS / Form 26AS Matched
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tax-comp-summary-grid">
          <div className="tax-comp-stat-box">
            <div className="tax-comp-stat-label">Gross Total Taxable</div>
            <div className="tax-comp-stat-val">
              ₹{data.totalTaxableIncome.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="tax-comp-stat-box">
            <div className="tax-comp-stat-label">Total Tax Payable (incl. Cess)</div>
            <div className="tax-comp-stat-val">
              ₹{data.totalTaxPayable.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="tax-comp-stat-box">
            <div className="tax-comp-stat-label">TDS / Advance Tax Credits</div>
            <div className="tax-comp-stat-val" style={{ color: '#1e40af' }}>
              ₹{(data.advanceTaxPaid + data.tdsCreditsClaimed).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="tax-comp-stat-box" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
            <div className="tax-comp-stat-label" style={{ color: '#c2410c' }}>
              Net Eligible Refund
            </div>
            <div className="tax-comp-stat-val" style={{ color: '#ea580c' }}>
              ₹{data.netRefundOrPayable.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isApproved ? (
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                }}
              >
                ✓ Computation Approved for E-Filing
              </span>
            ) : (
              <button
                type="button"
                className="tax-comp-action-btn"
                onClick={handleApprove}
              >
                Approve Computation & Authorize E-Filing →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaxComputation
