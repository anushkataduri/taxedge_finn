import { useMemo, useState } from 'react'
import {
  calculateRegimeTax,
  INITIAL_FILE_ITR_STATE,
  type FileItrFormData,
} from './FileItr'
import { ShieldCheckIcon } from '../ItrIcons'
import './FileItr.css'

export interface FileItrProps {
  onSuccessFiling?: (refId: string) => void
}

export const FileItr = ({ onSuccessFiling }: FileItrProps) => {
  const [formData, setFormData] = useState<FileItrFormData>(INITIAL_FILE_ITR_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [assignedRef, setAssignedRef] = useState('')

  const regimeTaxData = useMemo(() => {
    return calculateRegimeTax(
      formData.annualGrossIncome,
      formData.deductions80C,
      formData.deductions80D,
      formData.tdsDeducted,
    )
  }, [
    formData.annualGrossIncome,
    formData.deductions80C,
    formData.deductions80D,
    formData.tdsDeducted,
  ])

  const handleInputChange = (field: keyof FileItrFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? Number(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      const generatedRef = `ITR-2026-${Math.floor(10000 + Math.random() * 90000)}`
      setAssignedRef(generatedRef)
      setIsSubmitting(false)
      setIsSubmitted(true)
      if (onSuccessFiling) {
        onSuccessFiling(generatedRef)
      }
    }, 800)
  }

  const incomeSources = [
    { value: 'salary', label: 'Salaried Employee (ITR-1 / ITR-2)' },
    { value: 'business', label: 'Business / Proprietorship (ITR-3 / ITR-4)' },
    { value: 'capital_gains', label: 'Capital Gains & Trading (ITR-2)' },
    { value: 'freelance', label: 'Professional / 44ADA (ITR-4)' },
    { value: 'multiple', label: 'Multiple Income Streams (Comprehensive)' },
  ]

  return (
    <div className="file-itr-container">
      <div className="file-itr-hero">
        <div className="file-itr-hero__badge">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheckIcon size={14} strokeWidth={2.2} /> Verified CA Filing
          </span>
          <span>•</span>
          <span>AY 2026-27 (FY 2025-26)</span>
        </div>
        <h1 className="file-itr-hero__title">File Your Income Tax Return</h1>
        <p className="file-itr-hero__subtitle">
          Direct filing with AIS & TIS cross-verification. Your books are reconciled by a licensed CA
          before official ITD upload.
        </p>
      </div>

      {isSubmitted ? (
        <div className="file-itr-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>ITR Application Initiated!</h2>
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Your application <strong>{assignedRef}</strong> has been allocated to Senior CA Meera Iyer.
            Computation & AIS matching will begin instantly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
              ✓ Tracking enabled. You can monitor progress anytime from the dashboard.
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="file-itr-grid">
          <div className="file-itr-card">
            <div className="file-itr-card__header">
              <h2 className="file-itr-card__title">
                <span className="file-itr-card__accent-bar" />
                Taxpayer & Income Details
              </h2>
            </div>

            <div className="file-itr-row-2">
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">PAN Number</label>
                <input
                  type="text"
                  className="file-itr-input"
                  value={formData.panNumber}
                  maxLength={10}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Full Name as per PAN</label>
                <input
                  type="text"
                  className="file-itr-input"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="file-itr-form-group">
              <label className="file-itr-form-label">Primary Source of Income</label>
              <select
                className="file-itr-select"
                value={formData.incomeSource}
                onChange={(e) => handleInputChange('incomeSource', e.target.value)}
              >
                {incomeSources.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="file-itr-row-2">
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Annual Gross Income (₹)</label>
                <input
                  type="number"
                  className="file-itr-input"
                  value={formData.annualGrossIncome}
                  onChange={(e) => handleInputChange('annualGrossIncome', e.target.value)}
                  required
                />
              </div>
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Total TDS Deducted (₹)</label>
                <input
                  type="number"
                  className="file-itr-input"
                  value={formData.tdsDeducted}
                  onChange={(e) => handleInputChange('tdsDeducted', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="file-itr-row-2">
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Chapter VI-A Deductions 80C (₹)</label>
                <input
                  type="number"
                  className="file-itr-input"
                  value={formData.deductions80C}
                  onChange={(e) => handleInputChange('deductions80C', e.target.value)}
                />
              </div>
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Health Insurance 80D (₹)</label>
                <input
                  type="number"
                  className="file-itr-input"
                  value={formData.deductions80D}
                  onChange={(e) => handleInputChange('deductions80D', e.target.value)}
                />
              </div>
            </div>

            <div className="file-itr-row-2">
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Refund Bank Account Number</label>
                <input
                  type="text"
                  className="file-itr-input"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  required
                />
              </div>
              <div className="file-itr-form-group">
                <label className="file-itr-form-label">Bank IFSC Code</label>
                <input
                  type="text"
                  className="file-itr-input"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
          </div>

          <div className="file-itr-card">
            <div className="file-itr-card__header">
              <h2 className="file-itr-card__title">
                <span className="file-itr-card__accent-bar" />
                Regime Comparison & CA Review
              </h2>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              TaxEdge CA automatically selects the regime offering the highest refund or lowest liability:
            </p>

            <div className="file-itr-regime-box">
              <div
                className={`file-itr-regime-card ${
                  formData.regime === 'new' ? 'file-itr-regime-card--selected' : ''
                }`}
                onClick={() => handleInputChange('regime', 'new')}
              >
                <div className="file-itr-regime-card__title">New Tax Regime</div>
                <div className="file-itr-regime-card__val">
                  ₹{regimeTaxData.newRegime.taxPayable.toLocaleString('en-IN')}
                </div>
                <span className="file-itr-regime-card__tag">
                  {regimeTaxData.newRegime.netTaxOrRefund >= 0
                    ? `Refund: ₹${regimeTaxData.newRegime.netTaxOrRefund.toLocaleString('en-IN')}`
                    : `Payable: ₹${Math.abs(regimeTaxData.newRegime.netTaxOrRefund).toLocaleString('en-IN')}`}
                </span>
              </div>

              <div
                className={`file-itr-regime-card ${
                  formData.regime === 'old' ? 'file-itr-regime-card--selected' : ''
                }`}
                onClick={() => handleInputChange('regime', 'old')}
              >
                <div className="file-itr-regime-card__title">Old Tax Regime</div>
                <div className="file-itr-regime-card__val">
                  ₹{regimeTaxData.oldRegime.taxPayable.toLocaleString('en-IN')}
                </div>
                <span className="file-itr-regime-card__tag">
                  {regimeTaxData.oldRegime.netTaxOrRefund >= 0
                    ? `Refund: ₹${regimeTaxData.oldRegime.netTaxOrRefund.toLocaleString('en-IN')}`
                    : `Payable: ₹${Math.abs(regimeTaxData.oldRegime.netTaxOrRefund).toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '0.825rem',
                color: '#1e40af',
                lineHeight: 1.4,
              }}
            >
              <strong>💡 CA Reconciliation Guarantee:</strong> Before filing, CA Meera Iyer will fetch your
              Form 26AS, AIS, and TIS to verify advance tax, self-assessment tax, and high-value transactions.
            </div>

            <button type="submit" className="file-itr-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Validating PAN & AIS Data...' : 'Submit to CA & File ITR →'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default FileItr
