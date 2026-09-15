import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { routePaths } from '@core/config'
import { GSTComplianceSubmitted } from './GSTComplianceSubmitted'
import './GSTComplianceCard.css'

export interface ComplianceFormData {
  gstin: string; financialYear: string; requestType: 'Reconciliation Support' | 'Notice Response'
  purchaseDoc: File | null; salesDoc: File | null; gstr2bRef: string; gstr2bDoc?: File | null
  noticeNumber?: string; noticeDoc?: File | null; dueDate?: string; replyDraft: string
}
export interface GSTComplianceCardProps {
  title?: string; subtitle?: string; initialGstin?: string; initialFinancialYear?: string
  initialRequestType?: 'Reconciliation Support' | 'Notice Response'; onAllForms?: () => void; onSubmit?: (d: ComplianceFormData) => void
}

const ChevronIcon = () => (<span className="compliance-select-chevron" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></span>)
const UploadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>)
const EyeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>)
const TrashIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>)

const FieldRow: React.FC<{ num: number | string; label: string; required?: boolean; badge?: React.ReactNode; hint?: string; error?: string; children: React.ReactNode }> = ({ num, label, required, badge, hint, error, children }) => (
  <div className="compliance-field-row">
    <div className="compliance-field-num" aria-hidden="true">{num}</div>
    <div className="compliance-field-content">
      <div className="compliance-field-label-group"><label className="compliance-field-label">{label} {required && <span className="compliance-required-mark">*</span>}</label>{badge}</div>
      {children}{hint && <p className="compliance-field-hint">{hint}</p>}{error && <span className="compliance-field-error">{error}</span>}
    </div>
  </div>
)

const FileDropzone: React.FC<{
  file: File | null; onFileSelect: (f: File) => void; onFileRemove?: () => void; onFileView?: (f: File) => void
  hasError?: boolean; accept?: string; label: string
}> = ({ file, onFileSelect, onFileRemove, onFileView, hasError, accept = '.pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv', label }) => (
  file ? (
    <div className={`compliance-upload-dropzone compliance-upload-dropzone--uploaded ${hasError ? 'has-error' : ''}`} aria-label={label}>
      <div className="compliance-upload-left compliance-upload-left--clickable" onClick={() => onFileView?.(file)} title="Click to preview this document" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFileView?.(file) } }}>
        <div className="compliance-upload-icon-box compliance-upload-icon-box--uploaded" aria-hidden="true"><UploadIcon /></div>
        <div className="compliance-upload-meta"><span className="compliance-upload-title">{file.name}</span><span className="compliance-upload-subtitle">{`${(file.size / (1024 * 1024)).toFixed(2)} MB · File uploaded`}</span></div>
      </div>
      <div className="compliance-upload-actions">
        <button type="button" className="compliance-view-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFileView?.(file) }} title="View uploaded document"><EyeIcon /> View</button>
        <button type="button" className="compliance-delete-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFileRemove?.() }} title="Delete uploaded file" aria-label="Delete uploaded file"><TrashIcon /></button>
      </div>
    </div>
  ) : (
    <label className={`compliance-upload-dropzone ${hasError ? 'has-error' : ''}`} aria-label={label}>
      <input type="file" accept={accept} onChange={(e) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); e.target.value = '' }} style={{ display: 'none' }} />
      <div className="compliance-upload-left">
        <div className="compliance-upload-icon-box" aria-hidden="true"><UploadIcon /></div>
        <div className="compliance-upload-meta"><span className="compliance-upload-title">Choose a file to upload</span><span className="compliance-upload-subtitle">PDF, JPG or PNG · up to 10 MB</span></div>
      </div>
      <span className="compliance-browse-btn">Browse</span>
    </label>
  )
)

const ComplianceDocPreviewModal: React.FC<{ file: File; title: string; onClose: () => void }> = ({ file, title, onClose }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  useEffect(() => { const u = URL.createObjectURL(file); setFileUrl(u); return () => URL.revokeObjectURL(u) }, [file])
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [onClose])

  const isImg = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
  const isSheet = /\.(xlsx|xls|csv)$/i.test(file.name) || file.type.includes('spreadsheet') || file.type.includes('csv')
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2)

  return (
    <div className="compliance-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="compliance-modal-title" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="compliance-modal-container">
        <div className="compliance-modal-header">
          <div className="compliance-modal-header__left">
            <span className="compliance-modal-badge"><span className="compliance-modal-badge-dot" aria-hidden="true">●</span>{title}</span>
            <h3 id="compliance-modal-title" className="compliance-modal-title">{file.name}</h3>
            <p className="compliance-modal-meta"><span>{sizeMb} MB</span><span>·</span><span>{file.type || 'Document'}</span><span>·</span><span className="compliance-modal-meta-status">✓ Uploaded & verified</span></p>
          </div>
          <button type="button" className="compliance-modal-close-btn" onClick={onClose} aria-label="Close document preview">✕</button>
        </div>
        <div className="compliance-modal-body">
          {fileUrl && isImg && <div className="compliance-modal-image-wrap"><img src={fileUrl} alt={file.name} className="compliance-modal-image" /></div>}
          {fileUrl && isPdf && (<div className="compliance-modal-pdf-wrap"><object data={fileUrl} type="application/pdf" className="compliance-modal-pdf-object"><iframe src={fileUrl} title={file.name} className="compliance-modal-pdf-iframe" /></object></div>)}
          {isSheet ? (
            <div className="compliance-modal-sheet-wrap">
              <div className="compliance-modal-sheet-icon" aria-hidden="true">📊</div><h4 className="compliance-modal-sheet-title">{file.name}</h4>
              <p className="compliance-modal-sheet-desc">Spreadsheet statement parsed and attached. Your GST executive will parse and reconcile this record against GSTR-2B.</p>
              <div className="compliance-modal-sheet-tags"><span className="compliance-modal-pill">Excel / CSV Format</span><span className="compliance-modal-pill">{sizeMb} MB</span><span className="compliance-modal-pill">TaxEdge Verified</span></div>
            </div>
          ) : !isImg && !isPdf && (
            <div className="compliance-modal-file-wrap">
              <div className="compliance-modal-file-icon" aria-hidden="true">📄</div><h4 className="compliance-modal-sheet-title">{file.name}</h4>
              <p className="compliance-modal-sheet-desc">Document attached and ready for compliance verification.</p>
              <div className="compliance-modal-sheet-tags"><span className="compliance-modal-pill">{sizeMb} MB</span></div>
            </div>
          )}
        </div>
        <div className="compliance-modal-footer">
          <div className="compliance-modal-footer__left">
            {fileUrl && <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="compliance-modal-btn-open" title="Open file in a full-sized tab">Open in new tab ↗</a>}
            {fileUrl && <a href={fileUrl} download={file.name} className="compliance-modal-btn-download" title="Download file">Download</a>}
          </div>
          <button type="button" className="compliance-modal-btn-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}

export const GSTComplianceCard: React.FC<GSTComplianceCardProps> = ({
  title = 'GST Cancellation Form', subtitle = 'Live screen — numbered to match the field spec.',
  initialGstin = '27AXTPD4419K1ZP', initialFinancialYear = 'FY 2026-27', initialRequestType = 'Reconciliation Support',
  onAllForms, onSubmit,
}) => {
  const navigate = useNavigate(), location = useLocation()
  const [gstin, setGstin] = useState(initialGstin), [financialYear, setFinancialYear] = useState(initialFinancialYear)
  const [requestType, setRequestType] = useState<'Reconciliation Support' | 'Notice Response'>(initialRequestType)
  const [purchaseFile, setPurchaseFile] = useState<File | null>(null), [salesFile, setSalesFile] = useState<File | null>(null)
  const [gstr2bRef, setGstr2bRef] = useState(''), [gstr2bFile, setGstr2bFile] = useState<File | null>(null)
  const [noticeNumber, setNoticeNumber] = useState(''), [noticeFile, setNoticeFile] = useState<File | null>(null)
  const [dueDate, setDueDate] = useState(''), [replyDraft, setReplyDraft] = useState('')
  const [previewDoc, setPreviewDoc] = useState<{ file: File; title: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({}), [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmitted = location.pathname === routePaths.gst.complianceSubmitted || location.search.includes('submitted')
  const [applicationId] = useState('GST-2026-00132')

  const clearErr = (k: string) => setErrors((p) => { const { [k]: _, ...rest } = p; return rest })
  const handleGstinChange = (v: string) => { setGstin(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15)); clearErr('gstin') }

  const validateForm = () => {
    const errs: Record<string, string> = {}, g = gstin.trim().toUpperCase()
    if (!g) errs.gstin = 'GSTIN or PAN is required'
    else if (g.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(g)) errs.gstin = 'Invalid 10-character PAN format (e.g. AXTPD4419K)'
    else if (g.length !== 15 && g.length !== 10) errs.gstin = `Must be 15-character GSTIN or 10-character PAN (currently ${g.length} characters)`
    else if (g.length === 15 && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g)) errs.gstin = 'Invalid GSTIN format (e.g. 27AXTPD4419K1ZP with valid 10-char PAN)'

    if (!financialYear) errs.financialYear = 'Financial Year is required'
    if (!requestType) errs.requestType = 'Request Type is required'
    if (!purchaseFile) errs.purchaseFile = 'Purchase register document is required'

    if (requestType === 'Reconciliation Support') {
      if (!salesFile) errs.salesFile = 'Sales register document is required'
      if (!gstr2bRef.trim() && !gstr2bFile) errs.gstr2bRef = 'GSTR-2B Reference number or statement file is required'
    } else {
      if (!noticeNumber.trim() || noticeNumber.trim().length < 5) errs.noticeNumber = !noticeNumber.trim() ? 'Department Notice Number is required' : 'Department Notice Number must be at least 5 characters'
      if (!noticeFile) errs.noticeFile = 'Notice document upload is required'
      if (!dueDate) errs.dueDate = 'Response due date is required'
    }
    setErrors(errs); return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate(`${routePaths.gst.compliance}?status=submitted`, { replace: true })
      onSubmit?.({
        gstin, financialYear, requestType, purchaseDoc: purchaseFile, salesDoc: salesFile, gstr2bRef, gstr2bDoc: gstr2bFile,
        noticeNumber: requestType === 'Notice Response' ? noticeNumber : undefined,
        noticeDoc: requestType === 'Notice Response' ? noticeFile : undefined,
        dueDate: requestType === 'Notice Response' ? dueDate : undefined, replyDraft,
      })
    }, 600)
  }

  if (isSubmitted) {
    return (
      <GSTComplianceSubmitted
        applicationId={applicationId} gstin={gstin} requestType={requestType}
        fieldsCount={requestType === 'Reconciliation Support' ? 7 : 10}
        onBackToForm={() => navigate(routePaths.gst.compliance, { replace: true })}
        onAllForms={onAllForms ?? (() => navigate(routePaths.gst.root))}
      />
    )
  }

  return (
    <div className="gst-compliance-spec-card">
      <div className="compliance-spec-header">
        <div className="compliance-spec-header__left"><h2 className="compliance-spec-title">{title}</h2><p className="compliance-spec-subtitle">{subtitle}</p></div>
        <div className="compliance-spec-badge">{requestType === 'Reconciliation Support' ? '7' : '10'} of 10 shown</div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="compliance-spec-form">
        <FieldRow num={1} label="GSTIN / PAN" hint="15-character GSTIN or 10-character PAN. Letters auto-capitalize to uppercase." error={errors.gstin}
          badge={<span className="compliance-autofill-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="compliance-check-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Auto-filled</span>}>
          <div className="compliance-gstin-box"><input id="compliance-gstin" name="gstin" type="text" maxLength={15} placeholder="e.g. 27AXTPD4419K1ZP or AXTPD4419K" value={gstin} onChange={(e) => handleGstinChange(e.target.value)} className={`compliance-gstin-input ${errors.gstin ? 'has-error' : ''}`} /></div>
        </FieldRow>

        <FieldRow num={2} label="Period / Financial Year" required hint="Which month or year the check covers">
          <div className="compliance-select-wrapper">
            <select id="compliance-fy" name="financialYear" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className="compliance-select">
              {['FY 2026-27', 'FY 2025-26', 'FY 2024-25', 'FY 2023-24'].map((y) => <option key={y} value={y}>{y}</option>)}
            </select><ChevronIcon />
          </div>
        </FieldRow>

        <FieldRow num={3} label="Type of Request" required hint="Reconciliation Support or Notice Response">
          <div className="compliance-select-wrapper">
            <select id="compliance-request-type" name="requestType" value={requestType} onChange={(e) => setRequestType(e.target.value as 'Reconciliation Support' | 'Notice Response')} className="compliance-select">
              {['Reconciliation Support', 'Notice Response'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select><ChevronIcon />
          </div>
        </FieldRow>

        <FieldRow num={4} label="Purchase Register" required hint="Required" error={errors.purchaseFile}>
          <FileDropzone label="Upload Purchase Register" file={purchaseFile} hasError={!!errors.purchaseFile} onFileSelect={(f) => { setPurchaseFile(f); clearErr('purchaseFile') }} onFileRemove={() => setPurchaseFile(null)} onFileView={(f) => setPreviewDoc({ file: f, title: 'Purchase Register' })} />
        </FieldRow>

        <FieldRow num={5} label="Sales Register" required hint="Required" error={errors.salesFile}>
          <FileDropzone label="Upload Sales Register" file={salesFile} hasError={!!errors.salesFile} onFileSelect={(f) => { setSalesFile(f); clearErr('salesFile') }} onFileRemove={() => setSalesFile(null)} onFileView={(f) => setPreviewDoc({ file: f, title: 'Sales Register' })} />
        </FieldRow>

        <FieldRow num={6} label="GSTR-2B Reference" required hint="The government's auto-generated purchase statement" error={errors.gstr2bRef}>
          <div className="compliance-hybrid-input-wrapper">
            {gstr2bFile ? (
              <div className="compliance-attached-file-box">
                <div className="compliance-attached-file-info compliance-attached-file-info--clickable" onClick={() => setPreviewDoc({ file: gstr2bFile, title: 'GSTR-2B Statement' })} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPreviewDoc({ file: gstr2bFile, title: 'GSTR-2B Statement' }) } }} title="Click to preview statement">
                  <span className="compliance-file-icon">📄</span>
                  <div><span className="compliance-attached-filename">{gstr2bFile.name}</span><span className="compliance-attached-filesize">{(gstr2bFile.size / (1024 * 1024)).toFixed(2)} MB · Statement attached</span></div>
                </div>
                <div className="compliance-upload-actions">
                  <button type="button" className="compliance-view-btn" onClick={() => setPreviewDoc({ file: gstr2bFile, title: 'GSTR-2B Statement' })} title="View uploaded statement"><EyeIcon /> View</button>
                  <button type="button" className="compliance-delete-btn" onClick={() => setGstr2bFile(null)} title="Delete uploaded statement" aria-label="Delete uploaded statement"><TrashIcon /></button>
                </div>
              </div>
            ) : (
              <div className="compliance-input-with-action">
                <input id="compliance-gstr2b" name="gstr2bRef" type="text" placeholder="Paste the GSTR-2B reference number, or upload the statement" value={gstr2bRef} onChange={(e) => { setGstr2bRef(e.target.value.toUpperCase()); clearErr('gstr2bRef') }} className={`compliance-text-input ${errors.gstr2bRef ? 'has-error' : ''}`} />
                <label className="compliance-inline-upload-btn" title="Upload statement file"><input type="file" accept=".pdf,.xlsx,.xls,.json,.csv" onChange={(e) => { if (e.target.files?.[0]) { setGstr2bFile(e.target.files[0]); clearErr('gstr2bRef') } }} style={{ display: 'none' }} /><UploadIcon /> Upload</label>
              </div>
            )}
          </div>
        </FieldRow>

        {requestType === 'Notice Response' && (
          <>
            <FieldRow num={7} label="Department Notice Number" required hint="Issued by GST department under section 61, 73, or 74" error={errors.noticeNumber}>
              <input id="compliance-notice-num" name="noticeNumber" type="text" placeholder="e.g. ZD270824001234M" value={noticeNumber} onChange={(e) => { setNoticeNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9/-]/g, '')); clearErr('noticeNumber') }} className={`compliance-text-input ${errors.noticeNumber ? 'has-error' : ''}`} />
            </FieldRow>
            <FieldRow num={8} label="Notice Document" required hint="Required" error={errors.noticeFile}>
              <FileDropzone label="Upload Notice Document" file={noticeFile} hasError={!!errors.noticeFile} accept=".pdf,.jpg,.jpeg,.png" onFileSelect={(f) => { setNoticeFile(f); clearErr('noticeFile') }} onFileRemove={() => setNoticeFile(null)} onFileView={(f) => setPreviewDoc({ file: f, title: 'Notice Document' })} />
            </FieldRow>
            <FieldRow num={9} label="Response Due Date" required hint="The statutory date indicated on the notice" error={errors.dueDate}>
              <input id="compliance-due-date" name="dueDate" type="date" value={dueDate} onChange={(e) => { setDueDate(e.target.value); clearErr('dueDate') }} className={`compliance-text-input ${errors.dueDate ? 'has-error' : ''}`} />
            </FieldRow>
          </>
        )}

        <FieldRow num={requestType === 'Reconciliation Support' ? 7 : 10} label="Reply / Response Draft" hint="Optional — can be filled in by staff instead">
          <textarea id="compliance-reply-draft" name="replyDraft" rows={4} placeholder="Optional. Leave blank and your GST executive will draft the reply for you." value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} className="compliance-textarea" />
        </FieldRow>

        <div className="compliance-actions-row">
          <button type="button" className="compliance-btn-secondary" onClick={onAllForms ?? (() => navigate(routePaths.gst.root))}><span aria-hidden="true">←</span> All forms</button>
          <button type="submit" disabled={isSubmitting} className="compliance-btn-primary">{isSubmitting ? 'Submitting...' : <>Submit GST Compliance <span aria-hidden="true">→</span></>}</button>
        </div>
      </form>

      {previewDoc && (<ComplianceDocPreviewModal file={previewDoc.file} title={previewDoc.title} onClose={() => setPreviewDoc(null)} />)}
    </div>
  )
}

export default GSTComplianceCard
