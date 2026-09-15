import { useRef } from 'react'
import type { ItrUploadedFile } from '../../validation/itrUploadValidation'
import type { IncomeTypeOption } from './ItrFiling'
import { DEFAULT_CHECKLIST_DOCUMENTS, INCOME_TYPE_OPTIONS } from './ItrFiling'

/* Shared Upload Row Component */
interface ItrUploadRowProps {
  id: string
  name: string
  formats: string
  icon?: string
  isUploaded: boolean
  fileInfo?: ItrUploadedFile
  onFileSelect: (id: string, file: File) => void
  onRemoveDoc: (id: string) => void
}

const ItrUploadRow = ({
  id,
  name,
  formats,
  icon = '📄',
  isUploaded,
  fileInfo,
  onFileSelect,
  onRemoveDoc,
}: ItrUploadRowProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className={`itr-upload-row ${isUploaded ? 'itr-upload-row--done' : ''}`}>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(id, f)
          e.target.value = ''
        }}
        aria-label={`Upload ${name}`}
      />
      <div className="itr-upload-row-left">
        <span className="itr-upload-icon">{icon}</span>
        <div>
          <div className="itr-upload-name">{name}</div>
          {fileInfo ? (
            <div className="itr-uploaded-file-meta">
              <span className="itr-uploaded-filename">📄 {fileInfo.name}</span>
              <span className="itr-uploaded-filesize">({fileInfo.size})</span>
            </div>
          ) : (
            <div className="itr-upload-formats">{formats}</div>
          )}
        </div>
      </div>
      <div className="itr-upload-actions">
        {fileInfo && (
          <button
            type="button"
            className="itr-upload-remove-btn"
            onClick={() => onRemoveDoc(id)}
            title="Remove document"
            aria-label={`Remove ${name}`}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className={`itr-upload-btn ${isUploaded ? 'itr-upload-btn--done' : ''}`}
          onClick={() => inputRef.current?.click()}
        >
          {isUploaded ? '✓ Uploaded' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export interface Step1Props {
  selectedIncomeId: string
  onSelectIncome: (id: string) => void
  activeIncome: IncomeTypeOption
}

export const ItrStep1View = ({ selectedIncomeId, onSelectIncome, activeIncome }: Step1Props) => (
  <>
    <div>
      <h2 className="itr-card-heading">What describes your income?</h2>
      <p className="itr-card-subheading">
        Your choice decides which ITR form applies and which questions we ask next.
      </p>
    </div>

    <div className="itr-income-grid">
      {INCOME_TYPE_OPTIONS.map((opt) => (
        <div
          key={opt.id}
          className={`itr-income-card ${selectedIncomeId === opt.id ? 'itr-income-card--selected' : ''}`}
          onClick={() => onSelectIncome(opt.id)}
        >
          <div className="itr-income-card-left">
            <div className="itr-income-icon">{opt.icon}</div>
            <div className="itr-income-info">
              <span className="itr-income-title">{opt.label}</span>
              <span className="itr-income-desc">{opt.description}</span>
            </div>
          </div>
          <div className="itr-income-radio">{selectedIncomeId === opt.id && '✓'}</div>
        </div>
      ))}
    </div>

    <div className="itr-form-note">
      <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
      <div>
        <strong>Form determined: {activeIncome.formType}</strong>
        <br />
        Based on "{activeIncome.label}". Change the selection above and the form — and the next screen's fields — change with it.
      </div>
    </div>
  </>
)

export interface Step2Props {
  activeIncome: IncomeTypeOption
  panNumber: string
  setPanNumber: (val: string) => void
  aadhaarNumber: string
  setAadhaarNumber: (val: string) => void
  salaryDetails: string
  setSalaryDetails: (val: string) => void
  uploadedDocs: Record<string, boolean>
  uploadedFiles: Record<string, ItrUploadedFile>
  onFileSelect: (id: string, file: File) => void
  onRemoveDoc: (id: string) => void
}

export const ItrStep2View = ({
  activeIncome,
  panNumber,
  setPanNumber,
  aadhaarNumber,
  setAadhaarNumber,
  salaryDetails,
  setSalaryDetails,
  uploadedDocs,
  uploadedFiles,
  onFileSelect,
  onRemoveDoc,
}: Step2Props) => (
  <>
    <div>
      <h2 className="itr-card-heading">A few details about your income</h2>
      <p className="itr-card-subheading">
        Only the fields relevant to "{activeIncome.label}" are shown, so the form never feels overwhelming.
      </p>
    </div>

    <div className="itr-form-row-2">
      <div className="itr-input-group">
        <label className="itr-input-label">PAN *</label>
        <input
          type="text"
          className="itr-text-input"
          value={panNumber}
          maxLength={10}
          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
        />
      </div>
      <div className="itr-input-group">
        <label className="itr-input-label">Aadhaar *</label>
        <input
          type="text"
          className="itr-text-input"
          placeholder="12-digit Aadhaar number"
          value={aadhaarNumber}
          maxLength={12}
          onChange={(e) => setAadhaarNumber(e.target.value)}
        />
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
        Required for {activeIncome.label}
      </span>
      <span style={{ fontSize: '0.75rem', color: '#1e3a8a', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
        • 5 fields · {activeIncome.formType}
      </span>
    </div>

    <div className="itr-upload-list">
      <ItrUploadRow
        id="form16"
        name="Form 16"
        formats="PDF, JPG or PNG · up to 10 MB"
        icon="📄"
        isUploaded={Boolean(uploadedDocs.form16)}
        fileInfo={uploadedFiles.form16}
        onFileSelect={onFileSelect}
        onRemoveDoc={onRemoveDoc}
      />

      <div className="itr-input-group">
        <label className="itr-input-label">Salary details</label>
        <input
          type="text"
          className="itr-text-input"
          placeholder="Enter amount or details"
          value={salaryDetails}
          onChange={(e) => setSalaryDetails(e.target.value)}
        />
      </div>

      <ItrUploadRow
        id="bank_statements"
        name="Bank statements"
        formats="PDF, JPG or PNG · up to 10 MB"
        icon="🏦"
        isUploaded={Boolean(uploadedDocs.bank_statements)}
        fileInfo={uploadedFiles.bank_statements}
        onFileSelect={onFileSelect}
        onRemoveDoc={onRemoveDoc}
      />

      <ItrUploadRow
        id="ais"
        name="AIS"
        formats="PDF, JPG or PNG · up to 10 MB"
        icon="📊"
        isUploaded={Boolean(uploadedDocs.ais)}
        fileInfo={uploadedFiles.ais}
        onFileSelect={onFileSelect}
        onRemoveDoc={onRemoveDoc}
      />

      <ItrUploadRow
        id="tis"
        name="TIS"
        formats="PDF, JPG or PNG · up to 10 MB"
        icon="📑"
        isUploaded={Boolean(uploadedDocs.tis)}
        fileInfo={uploadedFiles.tis}
        onFileSelect={onFileSelect}
        onRemoveDoc={onRemoveDoc}
      />
    </div>

    <div className="itr-form-note">
      <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
      <div>
        <strong>Conditional by design</strong>
        <br />
        Switch the income type on Screen 1 and this list rebuilds — a salaried filer never sees business-income fields.
      </div>
    </div>
  </>
)

export interface Step3Props {
  deduction80C: string
  setDeduction80C: (val: string) => void
  deduction80D: string
  setDeduction80D: (val: string) => void
  homeLoanInterest: string
  setHomeLoanInterest: (val: string) => void
  eduLoanInterest: string
  setEduLoanInterest: (val: string) => void
  otherDeductions: string
  setOtherDeductions: (val: string) => void
  previousItrChoice: 'previous_itr' | 'tax_notice' | 'none'
  setPreviousItrChoice: (val: 'previous_itr' | 'tax_notice' | 'none') => void
}

export const ItrStep3View = ({
  deduction80C,
  setDeduction80C,
  deduction80D,
  setDeduction80D,
  homeLoanInterest,
  setHomeLoanInterest,
  eduLoanInterest,
  setEduLoanInterest,
  otherDeductions,
  setOtherDeductions,
  previousItrChoice,
  setPreviousItrChoice,
}: Step3Props) => (
  <>
    <div>
      <h2 className="itr-card-heading">Deductions</h2>
      <p className="itr-card-subheading">
        Anything here reduces your taxable income, so it is worth filling in fully.
      </p>
    </div>

    <div className="itr-form-row-2">
      <div className="itr-input-group">
        <label className="itr-input-label">Investment details (80C)</label>
        <input
          type="text"
          className="itr-text-input"
          value={deduction80C}
          onChange={(e) => setDeduction80C(e.target.value)}
        />
      </div>
      <div className="itr-input-group">
        <label className="itr-input-label">Insurance (80D)</label>
        <input
          type="text"
          className="itr-text-input"
          value={deduction80D}
          onChange={(e) => setDeduction80D(e.target.value)}
        />
      </div>
    </div>

    <div className="itr-form-row-2">
      <div className="itr-input-group">
        <label className="itr-input-label">Home loan interest</label>
        <input
          type="text"
          className="itr-text-input"
          value={homeLoanInterest}
          onChange={(e) => setHomeLoanInterest(e.target.value)}
        />
      </div>
      <div className="itr-input-group">
        <label className="itr-input-label">Education loan interest</label>
        <input
          type="text"
          className="itr-text-input"
          placeholder="Section 80E"
          value={eduLoanInterest}
          onChange={(e) => setEduLoanInterest(e.target.value)}
        />
      </div>
    </div>

    <div className="itr-input-group">
      <label className="itr-input-label">Any other deductions</label>
      <textarea
        className="itr-text-input itr-textarea"
        placeholder="NPS, donations, savings interest, disability — anything else you claim"
        value={otherDeductions}
        onChange={(e) => setOtherDeductions(e.target.value)}
      />
    </div>

    <div>
      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
        Do you have a previous ITR or any tax notice to reference?
      </span>
    </div>

    <div className="itr-radio-cards-list">
      <div
        className={`itr-radio-card ${previousItrChoice === 'previous_itr' ? 'itr-radio-card--selected' : ''}`}
        onClick={() => setPreviousItrChoice('previous_itr')}
      >
        <div className="itr-income-card-left">
          <div className="itr-income-icon">📄</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
              Yes — a previous ITR
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              We will pull forward your carried-over losses and details
            </div>
          </div>
        </div>
        <div className="itr-income-radio">{previousItrChoice === 'previous_itr' && '✓'}</div>
      </div>

      <div
        className={`itr-radio-card ${previousItrChoice === 'tax_notice' ? 'itr-radio-card--selected' : ''}`}
        onClick={() => setPreviousItrChoice('tax_notice')}
      >
        <div className="itr-income-card-left">
          <div className="itr-income-icon">⚠️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
              Yes — a tax notice
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Your executive will factor it into this return
            </div>
          </div>
        </div>
        <div className="itr-income-radio">{previousItrChoice === 'tax_notice' && '✓'}</div>
      </div>

      <div
        className={`itr-radio-card ${previousItrChoice === 'none' ? 'itr-radio-card--selected' : ''}`}
        onClick={() => setPreviousItrChoice('none')}
      >
        <div className="itr-income-card-left">
          <div className="itr-income-icon">✓</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
              No, neither
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>This is a fresh filing</div>
          </div>
        </div>
        <div className="itr-income-radio">{previousItrChoice === 'none' && '✓'}</div>
      </div>
    </div>
  </>
)

export interface Step4Props {
  activeIncome: IncomeTypeOption
  uploadedDocs: Record<string, boolean>
  uploadedFiles: Record<string, ItrUploadedFile>
  onFileSelect: (docId: string, file: File) => void
  onRemoveDoc: (docId: string) => void
  uploadError?: string
}

export const ItrStep4View = ({
  activeIncome,
  uploadedDocs,
  uploadedFiles,
  onFileSelect,
  onRemoveDoc,
  uploadError,
}: Step4Props) => (
  <>
    <div>
      <h2 className="itr-card-heading">Your document checklist</h2>
      <p className="itr-card-subheading">
        Generated for "{activeIncome.label}" — only what your situation actually needs.
      </p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
        {Object.values(uploadedDocs).filter(Boolean).length} of {DEFAULT_CHECKLIST_DOCUMENTS.length} uploaded
      </span>
      <span style={{ fontSize: '0.75rem', color: '#ea580c', background: '#fff7ed', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
        • In progress
      </span>
    </div>

    {uploadError && (
      <div className="itr-validation-error-box">
        <span className="itr-validation-error-icon">⚠️</span>
        <span className="itr-validation-error-text">{uploadError}</span>
      </div>
    )}

    <div className="itr-upload-list">
      {DEFAULT_CHECKLIST_DOCUMENTS.map((doc) => (
        <ItrUploadRow
          key={doc.id}
          id={doc.id}
          name={doc.name}
          formats={doc.formats}
          icon="📁"
          isUploaded={Boolean(uploadedDocs[doc.id])}
          fileInfo={uploadedFiles[doc.id]}
          onFileSelect={onFileSelect}
          onRemoveDoc={onRemoveDoc}
        />
      ))}
    </div>

    <div className="itr-form-note" style={{ background: '#fffbeb', borderColor: '#fef3c7', color: '#92400e' }}>
      <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
      <div>
        <strong>Nothing is filed until the checklist is complete</strong>
        <br />
        Tap any row to simulate an upload — the ✓ appears and the bar moves.
      </div>
    </div>
  </>
)
