import { useState } from 'react'
import { formatCurrency } from '@shared/utils'
import './GSTFilingPeriod.css'

export interface FilingPeriodData {
  gstin: string
  businessName: string
  financialYear: string
  frequency: string
  selectedMonth: string
  returnType: 'combo' | 'gstr1' | 'nil' | ''
  baseFee: number
}

interface GSTFilingPeriodProps {
  initialData?: Partial<FilingPeriodData>
  onContinue: (data: FilingPeriodData) => void
  onCancel: () => void
}

const MONTH_FILING_CARDS = [
  { id: 'apr', month: 'April', year: '2026', fullName: 'April 2026', status: 'filed', subText: 'Filed' },
  { id: 'may', month: 'May', year: '2026', fullName: 'May 2026', status: 'filed', subText: 'Filed' },
  { id: 'jun', month: 'June', year: '2026', fullName: 'June 2026', status: 'filed', subText: 'Filed' },
  { id: 'jul', month: 'July', year: '2026', fullName: 'July 2026', status: 'filed', subText: 'Filed' },
  { id: 'aug', month: 'August', year: '2026', fullName: 'August 2026', status: 'active', subText: 'Due 20 Sep 2026' },
  { id: 'sep', month: 'September', year: '2026', fullName: 'September 2026', status: 'locked', subText: 'Not yet open' },
]

const RETURN_OPTIONS = [
  { id: 'combo' as const, title: 'GSTR-1 and GSTR-3B', desc: 'Outward supplies and the summary return — the usual pair', fee: 2500 },
  { id: 'gstr1' as const, title: 'GSTR-1 only', desc: 'Outward supplies statement', fee: 1500 },
  { id: 'nil' as const, title: 'Nil return', desc: 'No outward or inward supplies in the period', fee: 500 },
]

export const GSTFilingPeriod = ({ initialData, onContinue, onCancel }: GSTFilingPeriodProps) => {
  const [financialYear, setFinancialYear] = useState(initialData?.financialYear || 'FY 2026-27')
  const [frequency, setFrequency] = useState(initialData?.frequency || 'Monthly')
  const [selectedMonth, setSelectedMonth] = useState(initialData?.selectedMonth || '')
  const [returnType, setReturnType] = useState<'combo' | 'gstr1' | 'nil' | ''>(initialData?.returnType || '')
  const [errors, setErrors] = useState<{ month?: string; returnType?: string }>({})

  const baseFee = returnType ? (RETURN_OPTIONS.find((opt) => opt.id === returnType)?.fee ?? 0) : 0
  const gstAmount = Math.round(baseFee * 0.18)
  const totalPayable = baseFee + gstAmount

  const handleSelectMonth = (monthName: string) => {
    setSelectedMonth(monthName)
    setErrors((prev) => ({ ...prev, month: undefined }))
  }

  const handleSelectReturnType = (type: 'combo' | 'gstr1' | 'nil') => {
    setReturnType(type)
    setErrors((prev) => ({ ...prev, returnType: undefined }))
  }

  const handleProceed = () => {
    const newErrors: { month?: string; returnType?: string } = {}
    if (!selectedMonth) {
      newErrors.month = 'Please select a filing month (e.g. August 2026) to continue'
    }
    if (!returnType) {
      newErrors.returnType = 'Please select a return type to continue'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onContinue({
      gstin: '27AXTPD4419K1ZP',
      businessName: 'Shree Deshmukh Traders',
      financialYear,
      frequency,
      selectedMonth,
      returnType,
      baseFee,
    })
  }

  return (
    <div className="gst-period-wrapper">
      <header className="gst-period-header">
        <h1 className="gst-period-header__title">GST return filing</h1>
        <p className="gst-period-header__subtitle">Pick the GSTIN and the period you want filed.</p>
      </header>

      <div className="gst-period-layout">
        <main className="gst-period-main">
          {/* Section 1: GSTIN Card */}
          <section className="gst-period-card">
            <h2 className="gst-period-card__title">GSTIN</h2>
            <p className="gst-period-card__subtitle">You have one registration on this account.</p>

            <div className="gst-period-gstin-card" role="radio" aria-checked="true">
              <div className="gst-period-gstin-card__left">
                <div className="gst-period-gstin-card__icon-box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="9" y1="6" x2="15" y2="6" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                </div>
                <div className="gst-period-gstin-card__meta">
                  <span className="gst-period-gstin-card__number">27AXTPD4419K1ZP</span>
                  <span className="gst-period-gstin-card__details">Shree Deshmukh Traders · Maharashtra · Regular scheme</span>
                </div>
              </div>
              <div className="gst-period-gstin-card__check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </section>

          {/* Section 2: Period Card */}
          <section className={`gst-period-card ${errors.month ? 'gst-period-card--has-error' : ''}`}>
            <h2 className="gst-period-card__title">Period</h2>
            <p className="gst-period-card__subtitle">Filings are current through July 2026.</p>

            <div className="gst-period-filters">
              <div className="gst-period-filter-field">
                <label htmlFor="period-fy" className="gst-period-filter-label">Financial year</label>
                <div className="gst-period-select-wrap">
                  <select id="period-fy" className="gst-period-select" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                    <option value="FY 2026-27">FY 2026-27</option>
                    <option value="FY 2025-26">FY 2025-26</option>
                    <option value="FY 2024-25">FY 2024-25</option>
                  </select>
                  <svg className="gst-period-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div className="gst-period-filter-field">
                <label htmlFor="period-freq" className="gst-period-filter-label">Frequency</label>
                <div className="gst-period-select-wrap">
                  <select id="period-freq" className="gst-period-select gst-period-select--active" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly (QRMP)">Quarterly (QRMP)</option>
                  </select>
                  <svg className="gst-period-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2x3 Month Cards Grid */}
            <div className="gst-period-month-grid">
              {MONTH_FILING_CARDS.map((card) => {
                const isSelected = selectedMonth === card.fullName
                const isFiled = card.status === 'filed'
                const isLocked = card.status === 'locked'

                return (
                  <div
                    key={card.id}
                    className={`gst-period-card-item ${isSelected ? 'gst-period-card-item--active' : ''} ${isLocked ? 'gst-period-card-item--locked' : ''}`}
                    onClick={() => !isLocked && handleSelectMonth(card.fullName)}
                    role="button"
                    tabIndex={isLocked ? -1 : 0}
                  >
                    <div className="gst-period-card-item__body">
                      {card.status === 'active' ? (
                        <>
                          <div className="gst-period-card-item__title-single">{card.fullName}</div>
                          <div className={`gst-period-card-item__subtext ${isSelected ? 'gst-period-card-item__subtext--active' : ''}`}>
                            {card.subText}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="gst-period-card-item__title-stacked">
                            {card.month} {card.year}
                          </div>
                          <div className="gst-period-card-item__subtext">{card.subText}</div>
                        </>
                      )}
                    </div>

                    <div className="gst-period-card-item__indicator">
                      {isSelected && card.status === 'active' && (
                        <div className="gst-period-card-item__check" aria-label="Selected">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      {isFiled && (
                        <span className="gst-period-card-item__badge gst-period-card-item__badge--filed">
                          <span className="gst-period-badge-dot" /> Filed
                        </span>
                      )}
                      {isLocked && (
                        <span className="gst-period-card-item__badge gst-period-card-item__badge--locked">
                          <span className="gst-period-badge-dot" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {errors.month && (
              <p className="gst-period-error-msg" role="alert">
                <span aria-hidden="true">⚠️</span> {errors.month}
              </p>
            )}
          </section>

          {/* Section 3: Return Type Card */}
          <section className={`gst-period-card ${errors.returnType ? 'gst-period-card--has-error' : ''}`}>
            <h2 className="gst-period-card__title">Return type</h2>
            <div className="gst-period-return-list" role="radiogroup">
              {RETURN_OPTIONS.map((opt) => {
                const isSelected = returnType === opt.id
                return (
                  <div
                    key={opt.id}
                    className={`gst-period-return-item ${isSelected ? 'gst-period-return-item--active' : ''}`}
                    onClick={() => handleSelectReturnType(opt.id)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                  >
                    <div className="gst-period-return-item__left">
                      <div className="gst-period-return-item__icon-box" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div className="gst-period-return-item__content">
                        <span className="gst-period-return-item__title">{opt.title}</span>
                        <span className="gst-period-return-item__desc">{opt.desc}</span>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="gst-period-return-item__radio-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="gst-period-return-item__radio-empty" aria-hidden="true" />
                    )}
                  </div>
                )
              })}
            </div>
            {errors.returnType && (
              <p className="gst-period-error-msg" role="alert">
                <span aria-hidden="true">⚠️</span> {errors.returnType}
              </p>
            )}
          </section>

          {/* Actions */}
          <div className="gst-period-actions">
            <button type="button" className="gst-period-btn-cancel" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="gst-period-btn-continue"
              onClick={handleProceed}
            >
              Continue →
            </button>
          </div>
        </main>

        {/* Sticky Sidebar */}
        <aside className="gst-period-sidebar">
          <div className="gst-period-order-card">
            <h3 className="gst-period-order-card__title">Order summary</h3>
            <div className="gst-period-order-card__table">
              <div className="gst-period-order-card__row">
                <span className="gst-period-order-card__label">
                  {selectedMonth ? `GST Filing — ${selectedMonth.split(' ')[0].substring(0, 3)} ${selectedMonth.split(' ')[1] || ''}` : 'GST Filing'}
                </span>
                <span className="gst-period-order-card__value">{formatCurrency(baseFee)}</span>
              </div>
              <div className="gst-period-order-card__row">
                <span className="gst-period-order-card__label">GST @ 18%</span>
                <span className="gst-period-order-card__value">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="gst-period-order-card__divider" />
              <div className="gst-period-order-card__row gst-period-order-card__row--total">
                <span className="gst-period-order-card__total-label">Total payable</span>
                <span className="gst-period-order-card__total-amount">{formatCurrency(totalPayable)}</span>
              </div>
            </div>
            <div className="gst-period-order-card__delivery">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-period-clock-icon">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>2–3 working days</span>
            </div>
          </div>

          <div className="gst-period-deadline-box">
            <div className="gst-period-deadline-box__icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="gst-period-deadline-box__content">
              <h4 className="gst-period-deadline-box__title">18 days to the deadline</h4>
              <p className="gst-period-deadline-box__subtitle">GSTR-3B due 20 Sep 2026</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default GSTFilingPeriod
