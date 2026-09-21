import { useState } from 'react'
import { formatCurrency } from '@shared/utils'
import './GSTFilingDocuments.css'

interface GSTFilingDocumentsProps {
  selectedMonth?: string
  baseFee?: number
  onBack: () => void
  onNext: () => void
}

interface FilingDocItem {
  id: string
  title: string
  details: string
  status: 'ok' | 'up' | 'pend'
  progress?: number
  fileUrl?: string
  fileName?: string
  fileSize?: string
  fileType?: string
}

const getInitialDocs = (month: string): FilingDocItem[] => [
  { id: '1', title: `Sales invoices — ${month}`, details: '42 files · 6.2 MB · verified', status: 'ok' },
  { id: '2', title: `Purchase invoices — ${month}`, details: '38 files · 5.1 MB · verified', status: 'ok' },
  { id: '3', title: 'Expense invoices', details: '12 files · 1.4 MB · verified', status: 'ok' },
  { id: '4', title: 'Credit notes', details: 'If any were issued during the period', status: 'pend' },
  { id: '5', title: 'Debit notes', details: 'If any were issued during the period', status: 'pend' },
  { id: '6', title: `Bank statement — ${month}`, details: `HDFC_${month.replace(' ', '')}.pdf · 2.2 MB`, status: 'up', progress: 65, fileName: `HDFC_${month.replace(' ', '')}.pdf`, fileSize: '2.2 MB' },
  { id: '7', title: 'Previous period GST data', details: 'Auto-carried from July 2026 filing', status: 'ok' },
  { id: '8', title: 'E-way bill summary', details: 'Optional · helps reconcile outward supplies', status: 'pend' },
]

export const GSTFilingDocuments = ({
  selectedMonth = 'August 2026',
  baseFee = 2500,
  onBack,
  onNext,
}: GSTFilingDocumentsProps) => {
  const displayMonth = selectedMonth || 'August 2026'
  const [docs, setDocs] = useState<FilingDocItem[]>(() => getInitialDocs(displayMonth))
  const [isDragging, setIsDragging] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<FilingDocItem | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const verifiedCount = docs.filter((d) => d.status === 'ok').length
  const effectiveBaseFee = baseFee > 0 ? baseFee : 2500
  const gstAmount = Math.round(effectiveBaseFee * 0.18)
  const totalPayable = effectiveBaseFee + gstAmount

  const handleVerifyAllRequired = () => {
    setDocs((prev) =>
      prev.map((doc) =>
        ['1', '2', '6'].includes(doc.id)
          ? {
              ...doc,
              status: 'ok' as const,
              progress: 100,
              details: doc.details.includes('verified') ? doc.details : `${doc.details.split(' · ')[0]} · verified`,
            }
          : doc
      )
    )
    setValidationError(null)
  }

  const handleProceedToReview = () => {
    const mandatoryIds = ['1', '2', '6']
    const unverified = docs.filter((d) => mandatoryIds.includes(d.id) && d.status !== 'ok')
    if (unverified.length > 0) {
      const names = unverified.map((d) => d.title.split(' — ')[0]).join(', ')
      setValidationError(`Required documents (${names}) must be verified before continuing.`)
      return
    }
    setValidationError(null)
    onNext()
  }

  const formatFileSize = (bytes: number): string => {
    const mb = (bytes / (1024 * 1024)).toFixed(1)
    return Number(mb) > 0 ? `${mb} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  const simulateUpload = (id: string, file: File) => {
    const fileSize = formatFileSize(file.size)
    const fileUrl = URL.createObjectURL(file)
    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, status: 'up', details: `${file.name} · ${fileSize}`, progress: 35, fileUrl, fileName: file.name, fileSize, fileType: file.type }
          : doc
      )
    )
    setTimeout(() => {
      setDocs((prev) => prev.map((doc) => (doc.id === id && doc.status === 'up' ? { ...doc, progress: 75 } : doc)))
    }, 350)
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((doc) =>
          doc.id === id && doc.status === 'up'
            ? { ...doc, status: 'ok', progress: 100, details: `${file.name} · ${fileSize} · verified` }
            : doc
        )
      )
    }, 750)
  }

  const handleSingleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { simulateUpload(id, file); e.target.value = '' }
  }

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file, idx) => { if (idx < docs.length) simulateUpload(docs[idx].id, file) })
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      Array.from(files).forEach((file, idx) => { if (idx < docs.length) simulateUpload(docs[idx].id, file) })
    }
  }

  return (
    <div className="gst-docs-wrapper">
      <header className="gst-docs-header">
        <div className="gst-docs-header__left">
          <h1 className="gst-docs-header__title">Upload for {displayMonth}</h1>
          <p className="gst-docs-header__subtitle">Checklist generated for a regular-scheme trading proprietorship.</p>
        </div>
        <div className="gst-docs-header__badge">
          <span className="gst-docs-badge-dot" /> {verifiedCount} of {docs.length} verified
        </div>
      </header>

      <div className="gst-docs-layout">
        <main className="gst-docs-main">
          <div
            className={`gst-docs-dropzone ${isDragging ? 'gst-docs-dropzone--dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="gst-docs-dropzone__icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <span className="gst-docs-dropzone__title">Drag your invoice files here</span>
            <span className="gst-docs-dropzone__subtitle">Bulk upload supported — PDF, JPG, PNG, XLSX</span>
            <label className="gst-docs-dropzone__browse-btn">
              Browse files
              <input type="file" multiple className="gst-docs-hidden-file" onChange={handleBulkUpload} />
            </label>
          </div>

          {validationError && (
            <div className="gst-docs-validation-alert" role="alert">
              <span>⚠️ {validationError}</span>
              <button
                type="button"
                className="gst-docs-validation-alert__btn"
                onClick={handleVerifyAllRequired}
              >
                Verify Remaining Files
              </button>
            </div>
          )}

          <section className="gst-docs-checklist-card">
            <h2 className="gst-docs-checklist-title">Checklist</h2>
            <div className="gst-docs-checklist-list">
              {docs.map((doc) => {
                const isVerified = doc.status === 'ok'
                const isUploading = doc.status === 'up'
                const isPending = doc.status === 'pend'
                const isMandatory = ['1', '2', '6'].includes(doc.id)
                const isHighlightedError = Boolean(validationError && isMandatory && !isVerified)

                return (
                  <div key={doc.id} className={`gst-docs-item ${isHighlightedError ? 'gst-docs-item--unverified' : ''}`}>
                    <div className="gst-docs-item__left">
                      <div className={`gst-docs-item__icon-box ${isVerified ? 'gst-docs-item__icon-box--verified' : isUploading ? 'gst-docs-item__icon-box--uploading' : ''}`} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isVerified ? 3 : 2} strokeLinecap="round" strokeLinejoin="round">
                          {isVerified ? <polyline points="20 6 9 17 4 12" /> : <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
                        </svg>
                      </div>
                      <div className="gst-docs-item__meta">
                        <span className="gst-docs-item__name">
                          {doc.title} {isMandatory && <span style={{ color: '#ef4444' }}>*</span>}
                        </span>
                        <span className="gst-docs-item__details">{doc.details}</span>
                        {isUploading && (
                          <div className="gst-docs-progress-track">
                            <div className="gst-docs-progress-fill" style={{ width: `${doc.progress || 65}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="gst-docs-item__right">
                      {isVerified && <span className="gst-docs-item__badge gst-docs-item__badge--verified"><span className="gst-docs-badge-dot" /> Verified</span>}
                      {isUploading && <span className="gst-docs-item__badge gst-docs-item__badge--uploading"><span className="gst-docs-badge-dot gst-docs-badge-dot--orange" /> Uploading</span>}
                      {isPending && <span className="gst-docs-item__badge gst-docs-item__badge--pending"><span className="gst-docs-badge-dot" /> Pending</span>}
                      {isVerified ? (
                        <button type="button" className="gst-docs-item__btn-view" onClick={() => setPreviewDoc(doc)}>View</button>
                      ) : (
                        <label className="gst-docs-item__btn-view">
                          Upload
                          <input type="file" className="gst-docs-hidden-file" onChange={(e) => handleSingleFileUpload(doc.id, e)} />
                        </label>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <div className="gst-docs-actions">
            <button type="button" className="gst-docs-btn-back" onClick={onBack}>← Back</button>
            <button type="button" className="gst-docs-btn-continue" onClick={handleProceedToReview}>Continue to review →</button>
          </div>
        </main>

        <aside className="gst-docs-sidebar">
          <div className="gst-docs-period-summary">
            <h3 className="gst-docs-period-summary__title">Period summary</h3>
            <div className="gst-docs-period-summary__table">
              <div className="gst-docs-period-summary__row"><span className="gst-docs-period-summary__label">Sales invoices</span><span className="gst-docs-period-summary__value">42</span></div>
              <div className="gst-docs-period-summary__row"><span className="gst-docs-period-summary__label">Purchase invoices</span><span className="gst-docs-period-summary__value">38</span></div>
              <div className="gst-docs-period-summary__row"><span className="gst-docs-period-summary__label">Taxable turnover</span><span className="gst-docs-period-summary__value">₹18,42,500</span></div>
              <div className="gst-docs-period-summary__row"><span className="gst-docs-period-summary__label">Input tax credit</span><span className="gst-docs-period-summary__value">₹1,96,400</span></div>
            </div>
          </div>

          <div className="gst-docs-order-card">
            <h3 className="gst-docs-order-card__title">Order summary</h3>
            <div className="gst-docs-order-card__table">
              <div className="gst-docs-order-card__row">
                <span className="gst-docs-order-card__label">{`GST Filing — ${displayMonth.split(' ')[0].substring(0, 3)} ${displayMonth.split(' ')[1] || '2026'}`}</span>
                <span className="gst-docs-order-card__value">{formatCurrency(effectiveBaseFee)}</span>
              </div>
              <div className="gst-docs-order-card__row"><span className="gst-docs-order-card__label">GST @ 18%</span><span className="gst-docs-order-card__value">{formatCurrency(gstAmount)}</span></div>
              <div className="gst-docs-order-card__divider" />
              <div className="gst-docs-order-card__row gst-docs-order-card__row--total">
                <span className="gst-docs-order-card__total-label">Total payable</span>
                <span className="gst-docs-order-card__total-amount">{formatCurrency(totalPayable)}</span>
              </div>
            </div>
            <div className="gst-docs-order-card__delivery">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="gst-docs-clock-icon"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>2–3 working days</span>
            </div>
          </div>

          <div className="gst-docs-deadline-box">
            <div className="gst-docs-deadline-box__icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <div className="gst-docs-deadline-box__content">
              <h4 className="gst-docs-deadline-box__title">18 days to the deadline</h4>
              <p className="gst-docs-deadline-box__subtitle">GSTR-3B due 20 Sep 2026</p>
            </div>
          </div>
        </aside>
      </div>

      {previewDoc && (
        <div className="gst-docs-modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="gst-docs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gst-docs-modal__header">
              <div className="gst-docs-modal__header-left">
                <span className="gst-docs-modal__badge">Verified document</span>
                <h3 className="gst-docs-modal__title">{previewDoc.title}</h3>
              </div>
              <button type="button" className="gst-docs-modal__btn-x" onClick={() => setPreviewDoc(null)} aria-label="Close">✕</button>
            </div>
            <div className="gst-docs-modal__body">
              <div className="gst-docs-modal__file-card">
                <div className="gst-docs-modal__file-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </div>
                <div className="gst-docs-modal__file-info">
                  <span className="gst-docs-modal__file-name">{previewDoc.fileName || previewDoc.details.split(' · ')[0]}</span>
                  <span className="gst-docs-modal__file-meta">{previewDoc.fileSize || 'Uploaded file'} · Verified for GST filing</span>
                </div>
              </div>
              {previewDoc.fileUrl && previewDoc.fileType?.startsWith('image/') ? (
                <div className="gst-docs-modal__preview-img-wrap">
                  <img src={previewDoc.fileUrl} alt={previewDoc.title} className="gst-docs-modal__preview-img" />
                </div>
              ) : (
                <div className="gst-docs-modal__preview-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="gst-docs-modal__doc-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                  <p className="gst-docs-modal__preview-text">Document verified and ready for computation.</p>
                </div>
              )}
            </div>
            <div className="gst-docs-modal__actions">
              {previewDoc.fileUrl && <a href={previewDoc.fileUrl} target="_blank" rel="noreferrer" className="gst-docs-modal__btn-open">Open file ↗</a>}
              <button type="button" className="gst-docs-modal__btn-close" onClick={() => setPreviewDoc(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GSTFilingDocuments
