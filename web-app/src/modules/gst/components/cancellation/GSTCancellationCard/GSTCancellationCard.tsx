import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { GSTCancellationSubmitted } from './GSTCancellationSubmitted'
import './GSTCancellationCard.css'

export interface CancellationFormData {
  gstin: string; reason: string; cancellationDate: string; closingStockDetails: string
  pendingLiabilities?: string; lastGstr3bFiled?: string; finalReturnDeclaration: boolean
}
export interface GSTCancellationCardProps {
  title?: string; subtitle?: string; initialGstin?: string; initialReason?: string; initialDate?: string
  onAllForms?: () => void; onSubmit?: (data: CancellationFormData) => void
}

const ChevronIcon = () => (<span className="cancellation-select-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></span>)
const CalendarIcon = () => (<span className="cancellation-input-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>)

const FieldRow: React.FC<{ num: number | string; label: string; required?: boolean; badge?: React.ReactNode; hint?: string; error?: string; children: React.ReactNode }> = ({ num, label, required, badge, hint, error, children }) => (
  <div className="cancellation-field-row">
    <div className="cancellation-field-num" aria-hidden="true">{num}</div>
    <div className="cancellation-field-content">
      <div className="cancellation-field-label-group"><label className="cancellation-field-label">{label} {required && <span className="cancellation-required-mark">*</span>}</label>{badge}</div>
      {children}
      {hint && <p className="cancellation-field-hint">{hint}</p>}
      {error && <span className="cancellation-field-error">{error}</span>}
    </div>
  </div>
)

export const GSTCancellationCard: React.FC<GSTCancellationCardProps> = ({
  title = 'GST Cancellation Form', subtitle = 'Live screen — numbered to match the field spec.',
  initialGstin = '27AXTPD4419K1ZP', initialReason = '', initialDate = '', onAllForms, onSubmit,
}) => {
  const navigate = useNavigate(), location = useLocation()
  const [gstin, setGstin] = useState(initialGstin), [reason, setReason] = useState(initialReason)
  const [cancellationDate, setCancellationDate] = useState(initialDate), [closingStockDetails, setClosingStockDetails] = useState('')
  const [pendingLiabilities, setPendingLiabilities] = useState(''), [lastGstr3bFiled, setLastGstr3bFiled] = useState('')
  const [finalReturnDeclaration, setFinalReturnDeclaration] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({}), [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmitted = location.pathname === routePaths.gst.cancellationSubmitted || location.search.includes('submitted')
  const [applicationId] = useState('GST-2026-00133')

  const clearErr = (k: string) => setErrors((p) => { const { [k]: _, ...rest } = p; return rest })
  const handleGstinChange = (v: string) => { setGstin(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15)); clearErr('gstin') }

  const validateForm = () => {
    const errs: Record<string, string> = {}, g = gstin.trim().toUpperCase()
    if (!g) errs.gstin = 'GSTIN is required'
    else if (g.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(g)) errs.gstin = 'Invalid 10-character PAN format (e.g. AXTPD4419K)'
    else if (g.length !== 15 && g.length !== 10) errs.gstin = `Must be a 15-character GSTIN (currently ${g.length} characters)`
    else if (g.length === 15 && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g)) errs.gstin = 'Invalid GSTIN format (e.g. 27AXTPD4419K1ZP)'

    if (!reason.trim()) errs.reason = 'Reason for Cancellation is required'
    if (!cancellationDate) errs.cancellationDate = 'Date Cancellation Is Sought is required'
    if (!closingStockDetails.trim()) errs.closingStockDetails = 'Details of Closing Stock is required'
    if (!finalReturnDeclaration) errs.finalReturnDeclaration = 'You must confirm the final return declaration before submitting.'
    setErrors(errs); return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate(`${routePaths.gst.cancellation}?status=submitted`, { replace: true })
      onSubmit?.({
        gstin, reason, cancellationDate, closingStockDetails,
        pendingLiabilities: pendingLiabilities.trim() || undefined,
        lastGstr3bFiled: lastGstr3bFiled.trim() || undefined, finalReturnDeclaration,
      })
    }, 600)
  }

  if (isSubmitted) {
    return (
      <GSTCancellationSubmitted
        applicationId={applicationId} gstin={gstin} fieldsCount={7}
        onBackToForm={() => navigate(routePaths.gst.cancellation, { replace: true })}
        onAllForms={onAllForms ?? (() => navigate(routePaths.gst.root))}
      />
    )
  }

  return (
    <div className="gst-cancellation-spec-card">
      <div className="cancellation-spec-header">
        <div className="cancellation-spec-header__left"><h1 className="cancellation-spec-title">{title}</h1><p className="cancellation-spec-subtitle">{subtitle}</p></div>
        <div className="cancellation-spec-badge" aria-label="Field count summary">7 of 7 shown</div>
      </div>

      <form className="cancellation-spec-form" onSubmit={handleSubmit} noValidate>
        {/* 1. GSTIN / PAN */}
        <FieldRow num={1} label="GSTIN / PAN" hint="15-character GSTIN or 10-character PAN. Letters auto-capitalize to uppercase." error={errors.gstin}
          badge={<span className="cancellation-autofilled-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Auto-filled</span>}>
          <div className="cancellation-gstin-box">
            <input id="cancellation-gstin" name="gstin" type="text" maxLength={15} placeholder="e.g. 27AXTPD4419K1ZP or AXTPD4419K"
              value={gstin} onChange={(e) => handleGstinChange(e.target.value)} className={`cancellation-gstin-input ${errors.gstin ? 'has-error' : ''}`} />
          </div>
        </FieldRow>

        {/* 2. Reason for Cancellation */}
        <FieldRow num={2} label="Reason for Cancellation" required hint="Business closed, turnover below threshold, business transferred, other" error={errors.reason}>
          <div className="cancellation-select-wrapper">
            <select className={`cancellation-select ${errors.reason ? 'has-error' : ''} ${!reason ? 'cancellation-select--placeholder' : ''}`}
              value={reason} onChange={(e) => { setReason(e.target.value); clearErr('reason') }}>
              <option value="" disabled>Select reason for cancellation</option>
              {['Business closed', 'Turnover below threshold', 'Business transferred', 'Other'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <ChevronIcon />
          </div>
        </FieldRow>

        {/* 3. Date Cancellation Is Sought */}
        <FieldRow num={3} label="Date Cancellation Is Sought" required hint="Required" error={errors.cancellationDate}>
          <div className="cancellation-input-wrapper cancellation-date-wrapper">
            <input type="date" className={`cancellation-text-input cancellation-date-input ${errors.cancellationDate ? 'has-error' : ''}`}
              value={cancellationDate} onClick={(e) => { try { ;(e.currentTarget as HTMLInputElement).showPicker?.() } catch {} }}
              onChange={(e) => { setCancellationDate(e.target.value); clearErr('cancellationDate') }} />
            <CalendarIcon />
          </div>
        </FieldRow>

        {/* 4. Details of Closing Stock */}
        <FieldRow num={4} label="Details of Closing Stock" required hint="Required" error={errors.closingStockDetails}>
          <div className="cancellation-input-wrapper">
            <textarea className={`cancellation-textarea ${errors.closingStockDetails ? 'has-error' : ''}`} rows={4}
              placeholder="Value and description of stock held on the cancellation date" value={closingStockDetails}
              onChange={(e) => { setClosingStockDetails(e.target.value); clearErr('closingStockDetails') }} />
          </div>
        </FieldRow>

        {/* 5. Pending Liabilities */}
        <FieldRow num={5} label="Pending Liabilities" hint="If any tax dues remain outstanding" error={errors.pendingLiabilities}>
          <div className="cancellation-input-wrapper">
            <input type="text" className="cancellation-text-input" placeholder='Enter the amount outstanding, or write "None"'
              value={pendingLiabilities} onChange={(e) => setPendingLiabilities(e.target.value)} />
          </div>
        </FieldRow>

        {/* 6. Last GSTR-3B Filed */}
        <FieldRow num={6} label="Last GSTR-3B Filed" hint="Reference to the most recently filed return" error={errors.lastGstr3bFiled}>
          <div className="cancellation-input-wrapper">
            <input type="text" className="cancellation-text-input" placeholder="e.g. July 2026 — ARN AA2708260041926"
              value={lastGstr3bFiled} onChange={(e) => { setLastGstr3bFiled(e.target.value.toUpperCase()); clearErr('lastGstr3bFiled') }} />
          </div>
        </FieldRow>

        {/* 7. Final Return Declaration */}
        <FieldRow num={7} label="Final Return Declaration" required hint="Confirms this will be the last return filed" error={errors.finalReturnDeclaration}>
          <div className="cancellation-checkbox-container">
            <label className={`cancellation-checkbox-label ${errors.finalReturnDeclaration ? 'has-error' : ''}`}>
              <input type="checkbox" className="cancellation-checkbox-input" checked={finalReturnDeclaration}
                onChange={(e) => { setFinalReturnDeclaration(e.target.checked); if (e.target.checked) clearErr('finalReturnDeclaration') }} />
              <span className="cancellation-checkbox-box" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5" /></svg>
              </span>
              <span className="cancellation-checkbox-text">I confirm this will be the final return filed under this GSTIN.</span>
            </label>
          </div>
        </FieldRow>

        {/* Action Buttons */}
        <div className="cancellation-form-actions">
          <button type="button" className="cancellation-btn-back" onClick={onAllForms ?? (() => navigate(routePaths.gst.root))}><span aria-hidden="true">←</span> All forms</button>
          <button type="submit" className="cancellation-btn-submit" disabled={isSubmitting}>
            {isSubmitting ? <span>Submitting...</span> : <><span>Submit GST Cancellation</span> <span aria-hidden="true">→</span></>}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GSTCancellationCard
