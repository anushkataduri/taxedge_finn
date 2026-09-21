import { useMemo, useState } from 'react'
import {
  calculateDetailedEstimator,
  INITIAL_DETAILED_ESTIMATOR,
  type DetailedEstimatorInput,
} from './TdsRefundEstimator'
import './TdsRefundEstimator.css'

export interface TdsRefundEstimatorProps {
  onClaim?: (refundAmount: number) => void
}

export const TdsRefundEstimator = ({ onClaim }: TdsRefundEstimatorProps) => {
  const [inputs, setInputs] = useState<DetailedEstimatorInput>(INITIAL_DETAILED_ESTIMATOR)
  const [hasClaimed, setHasClaimed] = useState(false)

  const results = useMemo(() => calculateDetailedEstimator(inputs), [inputs])

  const handleValueChange = (field: keyof DetailedEstimatorInput, val: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: Number(val) || 0,
    }))
  }

  const handleStartClaim = () => {
    setHasClaimed(true)
    if (onClaim) {
      onClaim(results.estimatedRefund)
    }
  }

  return (
    <div className="tds-est-container">
      <div className="tds-est-hero">
        <div className="tds-est-hero__badge">
          <span>⚡ Live Interactive Calculator</span>
          <span>•</span>
          <span>Form 26AS & AIS Calibrated</span>
        </div>
        <h1 className="tds-est-hero__title">Detailed TDS Refund Estimator</h1>
        <p className="tds-est-hero__subtitle">
          Dynamically adjust salary TDS, contract/freelance 194J TDS, bank interest TDS, and deductions
          to preview your exact eligible refund and TaxEdge success fee in real time.
        </p>
      </div>

      {hasClaimed ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎯</div>
          <h2 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Refund Claim for ₹{results.estimatedRefund.toLocaleString('en-IN')} Initiated!
          </h2>
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Your estimate has been forwarded to our direct tax advisory desk. Net bank credit will be
            approximately <strong>₹{results.netRefundCredited.toLocaleString('en-IN')}</strong>.
          </p>
        </div>
      ) : (
        <div className="tds-est-grid">
          <div className="tds-est-card">
            <h3 className="tds-est-card-title">Enter Your Tax Deductions & Income</h3>

            <div className="tds-est-input-group">
              <label className="tds-est-input-label">
                <span>Contract / Professional 194J TDS</span>
                <strong>₹{inputs.contractor194JTds.toLocaleString('en-IN')}</strong>
              </label>
              <input
                type="number"
                className="tds-est-input-field"
                value={inputs.contractor194JTds}
                onChange={(e) => handleValueChange('contractor194JTds', e.target.value)}
              />
            </div>

            <div className="tds-est-input-group">
              <label className="tds-est-input-label">
                <span>Salary TDS (Section 192)</span>
                <strong>₹{inputs.salaryTds.toLocaleString('en-IN')}</strong>
              </label>
              <input
                type="number"
                className="tds-est-input-field"
                value={inputs.salaryTds}
                onChange={(e) => handleValueChange('salaryTds', e.target.value)}
              />
            </div>

            <div className="tds-est-input-group">
              <label className="tds-est-input-label">
                <span>Bank Interest TDS (Section 194A)</span>
                <strong>₹{inputs.bankInterestTds.toLocaleString('en-IN')}</strong>
              </label>
              <input
                type="number"
                className="tds-est-input-field"
                value={inputs.bankInterestTds}
                onChange={(e) => handleValueChange('bankInterestTds', e.target.value)}
              />
            </div>

            <div className="tds-est-input-group">
              <label className="tds-est-input-label">
                <span>Annual Gross Income (₹)</span>
                <strong>₹{inputs.totalIncome.toLocaleString('en-IN')}</strong>
              </label>
              <input
                type="number"
                className="tds-est-input-field"
                value={inputs.totalIncome}
                onChange={(e) => handleValueChange('totalIncome', e.target.value)}
              />
            </div>

            <div className="tds-est-input-group">
              <label className="tds-est-input-label">
                <span>Chapter VI-A Deductions (80C, 80D)</span>
                <strong>₹{inputs.deductions.toLocaleString('en-IN')}</strong>
              </label>
              <input
                type="number"
                className="tds-est-input-field"
                value={inputs.deductions}
                onChange={(e) => handleValueChange('deductions', e.target.value)}
              />
            </div>
          </div>

          <div className="tds-est-card">
            <h3 className="tds-est-card-title">Live Computation & Fee Breakdown</h3>

            <div className="tds-est-result-box">
              <div className="tds-est-metric-row">
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total TDS Paid:</span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                  ₹{results.totalTdsDeducted.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="tds-est-metric-row">
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Estimated Tax Liability:</span>
                <strong style={{ fontSize: '0.95rem', color: '#334155' }}>
                  ₹{results.estimatedActualTax.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="tds-est-metric-row" style={{ padding: '0.85rem 0' }}>
                <span style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>
                  Estimated Gross Refund:
                </span>
                <strong style={{ fontSize: '1.6rem', color: '#ea580c' }}>
                  ₹{results.estimatedRefund.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="tds-est-metric-row">
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>TaxEdge Success Fee (15%):</span>
                <strong style={{ fontSize: '0.95rem', color: '#1e3a8a' }}>
                  ₹{results.taxEdgeFee.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="tds-est-metric-row">
                <span style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 700 }}>
                  Net Amount You Receive:
                </span>
                <strong style={{ fontSize: '1.25rem', color: '#059669' }}>
                  ₹{results.netRefundCredited.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: '#64748b',
                background: '#f8fafc',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              ℹ️ <strong>Zero Risk Policy:</strong> If the ITD determines zero refund, our service fee is ₹0.
            </div>

            <button type="button" className="tds-est-claim-now-btn" onClick={handleStartClaim}>
              Proceed with Refund Claim (₹{results.estimatedRefund.toLocaleString('en-IN')}) →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TdsRefundEstimator
