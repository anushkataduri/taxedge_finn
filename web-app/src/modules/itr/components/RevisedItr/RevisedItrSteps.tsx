import { useRef } from 'react'
import type { ItrUploadedFile } from '../../validation/itrUploadValidation'
import {
  CORRECTION_REASONS,
  REVISED_COMPARISON_DATA,
  REVISED_UPLOAD_ITEMS,
  type CorrectionReasonItem,
  type RevisedUploadItem,
} from './RevisedItr'

/* =========================================================
   Screen 1: Find Original Return
   ========================================================= */
export interface Step1Props {
  ackNumber: string
  setAckNumber: (val: string) => void
  selectedAY: string
  setSelectedAY: (val: string) => void
  onFindReturn: () => void
}

export const RevisedStep1View = ({
  ackNumber,
  setAckNumber,
  selectedAY,
  setSelectedAY,
  onFindReturn,
}: Step1Props) => (
  <>
    <div>
      <h2 className="revised-flow-card-heading">Let’s find your original return</h2>
      <p className="revised-flow-card-subheading">
        The department requires a revision to be linked to the exact original filing.
      </p>
    </div>

    <div className="revised-search-box">
      <div className="revised-form-row-2">
        <div className="revised-input-group">
          <label className="revised-input-label">
            Original ITR Acknowledgement Number <span style={{ color: '#ea580c' }}>*</span>
          </label>
          <input
            type="text"
            className="revised-text-input"
            value={ackNumber}
            onChange={(e) => setAckNumber(e.target.value)}
            placeholder="e.g. 284419250714208"
          />
        </div>

        <div className="revised-input-group">
          <label className="revised-input-label">
            Assessment Year it was filed for <span style={{ color: '#ea580c' }}>*</span>
          </label>
          <select
            className="revised-text-input"
            value={selectedAY}
            onChange={(e) => setSelectedAY(e.target.value)}
          >
            <option value="AY 2025-26">AY 2025-26</option>
            <option value="AY 2024-25">AY 2024-25</option>
            <option value="AY 2023-24">AY 2023-24</option>
          </select>
        </div>
      </div>

      <div>
        <button type="button" className="revised-find-btn" onClick={onFindReturn}>
          → Find my return
        </button>
      </div>
    </div>

    {/* Result Card: Matched Return */}
    <div className="revised-matched-card">
      <div className="revised-matched-header">
        <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Original return found</strong>
        <span className="revised-matched-badge">● Matched</span>
      </div>

      <div className="revised-matched-row">
        <span>Filed on</span>
        <strong>14 Jul 2025</strong>
      </div>
      <div className="revised-matched-row">
        <span>Form</span>
        <strong>ITR-3 · {selectedAY}</strong>
      </div>
      <div className="revised-matched-row">
        <span>Gross total income</span>
        <strong>₹8,12,400</strong>
      </div>
      <div className="revised-matched-row">
        <span>Status</span>
        <strong style={{ color: '#1e3a8a' }}>E-verified · processed</strong>
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 2: Correction Reason
   ========================================================= */
export interface Step2Props {
  selectedReason: string
  onSelectReason: (id: string) => void
}

export const RevisedStep2View = ({ selectedReason, onSelectReason }: Step2Props) => {
  const activeItem =
    CORRECTION_REASONS.filter((r) => r.id === selectedReason)[0] || CORRECTION_REASONS[0]

  return (
    <>
      <div>
        <h2 className="revised-flow-card-heading">What needs to be corrected?</h2>
        <p className="revised-flow-card-subheading">
          This tells your Tax Executive what changed without a long written explanation.
        </p>
      </div>

      <div className="revised-reasons-grid">
        {CORRECTION_REASONS.map((item: CorrectionReasonItem) => {
          const isSelected = item.id === selectedReason
          return (
            <div
              key={item.id}
              className={`revised-reason-card ${
                isSelected ? 'revised-reason-card--selected' : ''
              }`}
              onClick={() => onSelectReason(item.id)}
            >
              <div className="revised-reason-left">
                <div className="revised-reason-icon">{item.icon}</div>
                <div>
                  <div className="revised-reason-title">{item.title}</div>
                  <div className="revised-reason-desc">{item.description}</div>
                </div>
              </div>
              <div className="revised-reason-radio">
                {isSelected && <div className="revised-reason-radio-dot" />}
              </div>
            </div>
          )
        })}
      </div>

      <div className="revised-notice-box revised-notice-box--blue">
        <div className="revised-notice-title">Currently selected: {activeItem.title}</div>
        <div className="revised-notice-desc">
          The next screen highlights the fields most likely to be affected by this reason.
        </div>
      </div>
    </>
  )
}

/* =========================================================
   Screen 3: Edit Preloaded Fields
   ========================================================= */
export interface Step3Props {
  salaryIncome: string
  setSalaryIncome: (val: string) => void
  otherIncome: string
  setOtherIncome: (val: string) => void
  deduction80C: string
  setDeduction80C: (val: string) => void
  deduction80D: string
  setDeduction80D: (val: string) => void
  homeLoan: string
  setHomeLoan: (val: string) => void
  bankAccount: string
  setBankAccount: (val: string) => void
  ifscCode: string
  setIfscCode: (val: string) => void
  taxableIncome: string
  setTaxableIncome: (val: string) => void
}

export const RevisedStep3View = ({
  salaryIncome,
  setSalaryIncome,
  otherIncome,
  setOtherIncome,
  deduction80C,
  setDeduction80C,
  deduction80D,
  setDeduction80D,
  homeLoan,
  setHomeLoan,
  bankAccount,
  setBankAccount,
  ifscCode,
  setIfscCode,
  taxableIncome,
  setTaxableIncome,
}: Step3Props) => (
  <>
    <div>
      <h2 className="revised-flow-card-heading">Update only what changed</h2>
      <p className="revised-flow-card-subheading">
        Your original figures are pre-loaded — edit the ones that need correcting.
      </p>
    </div>

    <div className="revised-fields-grid">
      {/* Likely Change Field 1 */}
      <div className="revised-input-group">
        <div className="revised-label-row">
          <label className="revised-input-label">Salary / business income</label>
          <span className="revised-likely-badge">● Likely change</span>
        </div>
        <input type="text" className="revised-text-input revised-text-input--highlight" value={salaryIncome} onChange={(e) => setSalaryIncome(e.target.value)} />
      </div>

      {/* Likely Change Field 2 */}
      <div className="revised-input-group">
        <div className="revised-label-row">
          <label className="revised-input-label">Other income</label>
          <span className="revised-likely-badge">● Likely change</span>
        </div>
        <input type="text" className="revised-text-input revised-text-input--highlight" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} />
      </div>

      <div className="revised-input-group">
        <label className="revised-input-label">80C deduction</label>
        <input type="text" className="revised-text-input" value={deduction80C} onChange={(e) => setDeduction80C(e.target.value)} />
      </div>

      <div className="revised-input-group">
        <label className="revised-input-label">80D deduction</label>
        <input type="text" className="revised-text-input" value={deduction80D} onChange={(e) => setDeduction80D(e.target.value)} />
      </div>

      <div className="revised-input-group">
        <label className="revised-input-label">Home loan interest</label>
        <input type="text" className="revised-text-input" value={homeLoan} onChange={(e) => setHomeLoan(e.target.value)} />
      </div>

      <div className="revised-input-group">
        <label className="revised-input-label">Bank account for refund</label>
        <input type="text" className="revised-text-input" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
      </div>

      <div className="revised-input-group">
        <label className="revised-input-label">IFSC</label>
        <input type="text" className="revised-text-input" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
      </div>

      <div className="revised-input-group">
        <label className="revised-input-label">Taxable income</label>
        <input
          type="text"
          className="revised-text-input"
          value={taxableIncome}
          onChange={(e) => setTaxableIncome(e.target.value)}
        />
      </div>
    </div>

    <div className="revised-notice-box revised-notice-box--blue">
      <div className="revised-notice-title">Nothing re-entered from scratch</div>
      <div className="revised-notice-desc">
        ⓘ Every field is pre-filled from the original return. Highlighted fields are the ones your
        chosen reason — "Missed income" — usually affects.
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 4: Supporting Uploads & Note
   ========================================================= */
interface RevisedUploadRowProps {
  item: RevisedUploadItem
  file?: ItrUploadedFile
  onFileSelect: (id: string, file: File) => void
  onFileRemove: (id: string) => void
}

const RevisedUploadRow = ({ item, file, onFileSelect, onFileRemove }: RevisedUploadRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <div className={`revised-upload-row ${file ? 'revised-upload-row--done' : ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={(e) => {
          const picked = e.target.files?.[0]
          if (picked) onFileSelect(item.id, picked)
          e.target.value = ''
        }}
      />
      <div className="revised-upload-row-left">
        <div className="revised-upload-icon">{file ? '✓' : '↑'}</div>
        <div>
          <div className="revised-upload-name">{item.title}</div>
          <div className="revised-upload-formats">
            {file ? (
              <span className="revised-uploaded-file-meta">
                📎 {file.name} ({file.size})
              </span>
            ) : (
              item.sub
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {file && (
          <button
            type="button"
            className="revised-upload-remove-btn"
            onClick={() => onFileRemove(item.id)}
            title="Remove document"
          >
            ✕ Remove
          </button>
        )}
        <button
          type="button"
          className={`revised-upload-btn ${file ? 'revised-upload-btn--done' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? '✓ Uploaded' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export interface Step4Props {
  uploadedFiles: Record<string, ItrUploadedFile>
  onFileSelect: (id: string, file: File) => void
  onFileRemove: (id: string) => void
  uploadError: string | null
  notes: string
  setNotes: (val: string) => void
}

export const RevisedStep4View = ({
  uploadedFiles,
  onFileSelect,
  onFileRemove,
  uploadError,
  notes,
  setNotes,
}: Step4Props) => (
  <>
    <div>
      <h2 className="revised-flow-card-heading">Upload anything supporting the correction</h2>
      <p className="revised-flow-card-subheading">
        This gives your Tax Executive proof for the change being made. Max size: 10MB (PDF, JPG, PNG).
      </p>
    </div>

    {uploadError && (
      <div className="revised-validation-error-box">
        ⚠️ {uploadError}
      </div>
    )}

    <div className="revised-upload-list">
      {REVISED_UPLOAD_ITEMS.map((item: RevisedUploadItem) => (
        <RevisedUploadRow
          key={item.id}
          item={item}
          file={uploadedFiles[item.id]}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
        />
      ))}
    </div>

    <div className="revised-input-group">
      <label className="revised-input-label">Anything else the executive should know</label>
      <textarea
        className="revised-text-input revised-textarea"
        placeholder="Optional note about the correction"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  </>
)

/* =========================================================
   Screen 5: Review Revised Computation
   ========================================================= */
export interface Step5Props {
  selectedAY: string
  onRequestChange: () => void
  onApproveAndFile: () => void
}

export const RevisedStep5View = ({
  selectedAY,
  onRequestChange,
  onApproveAndFile,
}: Step5Props) => (
  <>
    <div>
      <div className="revised-belated-pill">● Revised Return · {selectedAY}</div>
      <h2 className="revised-flow-card-heading">Please review your revised computation</h2>
      <p className="revised-flow-card-subheading">
        Same review, approval, filing and e-verification as regular ITR Filing — labelled as a
        revision.
      </p>
    </div>

    {/* Comparison Table */}
    <div className="revised-table-wrapper">
      <table className="revised-comp-table">
        <thead>
          <tr>
            <th>LINE</th>
            <th>ORIGINAL</th>
            <th>REVISED</th>
            <th>CHANGE</th>
          </tr>
        </thead>
        <tbody>
          {REVISED_COMPARISON_DATA.map((row) => (
            <tr key={row.line}>
              <td>{row.line}</td>
              <td>{row.original}</td>
              <td style={{ fontWeight: 700, color: '#0f172a' }}>{row.revised}</td>
              <td
                style={{
                  fontWeight: 700,
                  color: row.isChangePositive ? '#ea580c' : '#64748b',
                }}
              >
                {row.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Hero Banner: Revised Refund */}
    <div className="revised-hero-banner">
      <div className="revised-hero-label">REVISED REFUND DUE</div>
      <div className="revised-hero-amount">₹12,458</div>
      <div className="revised-hero-sub">Down from ₹18,346 on the original return</div>
    </div>

    {/* Actions */}
    <div className="revised-comp-actions">
      <button type="button" className="revised-btn-outline" onClick={onRequestChange}>
        Request changes
      </button>
      <button type="button" className="revised-btn-primary" onClick={onApproveAndFile}>
        Approve &amp; file revision →
      </button>
    </div>
  </>
)
