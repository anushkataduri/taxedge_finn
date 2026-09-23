import { useRef } from 'react'
import {
  NOTICE_CHECKLIST_DOCS,
  type NoticeUploadItem,
  type UploadedFileInfo,
} from './TaxNoticeAssistance'

/* =========================================================
   Screen 1: Upload Notice & Details
   ========================================================= */
export interface Step1Props {
  noticeDocUploaded: boolean
  uploadedFile: UploadedFileInfo | null
  onFileSelect: (file: File) => void
  onRemoveFile: () => void
  noticeNumber: string
  setNoticeNumber: (val: string) => void
  noticeDate: string
  setNoticeDate: (val: string) => void
  uploadError?: string
  noticeNumberError?: string
}

export const NoticeStep1View = ({
  noticeDocUploaded,
  uploadedFile,
  onFileSelect,
  onRemoveFile,
  noticeNumber,
  setNoticeNumber,
  noticeDate,
  setNoticeDate,
  uploadError,
  noticeNumberError,
}: Step1Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
    e.target.value = ''
  }

  return (
    <>
      <div>
        <h2 className="notice-flow-card-heading">
          Received a notice from the Income Tax Department?
        </h2>
        <p className="notice-flow-card-subheading">
          Upload it here — we need the actual notice to understand what is being asked.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        aria-label="Upload Notice Document"
      />

      {/* Notice document upload row */}
      <div
        className={`notice-upload-hero-row ${
          uploadError ? 'notice-upload-hero-row--error' : ''
        } ${noticeDocUploaded ? 'notice-upload-hero-row--uploaded' : ''}`}
      >
        <div className="notice-upload-hero-left">
          <div className="notice-upload-hero-icon">
            {noticeDocUploaded ? '✓' : '↑'}
          </div>
          <div>
            <div className="notice-upload-hero-title">Notice document</div>
            {uploadedFile ? (
              <div className="notice-uploaded-file-meta">
                <span className="notice-uploaded-filename">📄 {uploadedFile.name}</span>
                <span className="notice-uploaded-filesize">({uploadedFile.size})</span>
              </div>
            ) : (
              <div className="notice-upload-hero-sub">
                Photo or PDF of the notice · up to 10 MB
              </div>
            )}
          </div>
        </div>

        <div className="notice-upload-actions">
          {uploadedFile && (
            <button
              type="button"
              className="notice-upload-remove-btn"
              onClick={onRemoveFile}
              title="Remove document"
              aria-label="Remove notice file"
            >
              ✕ Remove
            </button>
          )}
          <button
            type="button"
            className={`notice-upload-hero-btn ${
              noticeDocUploaded ? 'notice-upload-hero-btn--done' : ''
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {noticeDocUploaded ? '✓ Uploaded' : 'Upload'}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="notice-validation-error-box">
          <span className="notice-validation-error-icon">⚠️</span>
          <span className="notice-validation-error-text">{uploadError}</span>
        </div>
      )}

      <div className="notice-form-row-2">
        <div className="notice-input-group">
          <label className="notice-input-label">
            Notice Number <span style={{ color: '#ea580c' }}>*</span>
          </label>
          <input
            type="text"
            className={`notice-text-input ${
              noticeNumberError ? 'notice-text-input--error' : ''
            }`}
            value={noticeNumber}
            onChange={(e) => setNoticeNumber(e.target.value)}
            placeholder="e.g. CPC/2526/A3/284419260"
          />
          {noticeNumberError && (
            <span className="notice-field-error-text">⚠️ {noticeNumberError}</span>
          )}
        </div>

        <div className="notice-input-group">
          <label className="notice-input-label">Date on the notice</label>
          <input
            type="text"
            className="notice-text-input"
            value={noticeDate}
            onChange={(e) => setNoticeDate(e.target.value)}
            placeholder="DD-MM-YYYY"
          />
        </div>
      </div>

      <div className="notice-notice-box notice-notice-box--blue">
        <div className="notice-notice-title">Do not panic about a notice</div>
        <div className="notice-notice-desc">
          ⓘ Most notices are routine — a mismatch with your AIS, or a request for one clarification.
          Upload it and we will tell you exactly what it means.
        </div>
      </div>
    </>
  )
}

/* =========================================================
   Screen 2: Plain Language Explanation
   ========================================================= */
export const NoticeStep2View = () => (
  <>
    <div>
      <h2 className="notice-flow-card-heading">Here’s what this notice means</h2>
      <p className="notice-flow-card-subheading">
        A plain-language explanation from your Tax Executive — no jargon.
      </p>
    </div>

    <div className="notice-explain-card">
      <div className="notice-explain-header">
        <div className="notice-explain-title-row">
          <span className="notice-explain-icon">📄</span>
          <div>
            <div className="notice-explain-title">
              Section 143(1)(a) — Proposed adjustment
            </div>
            <div className="notice-explain-sub">
              Notice CPC/2526/A3/284419260 · dated 18 Aug 2026
            </div>
          </div>
        </div>
        <span className="notice-explain-badge">● Routine</span>
      </div>

      <div className="notice-explain-body">
        <div className="notice-explain-item">
          <strong>In plain words:</strong> The department's records show ₹42,000 of interest income
          that does not appear on your return. They are proposing to add it to your taxable income
          and are giving you a chance to respond before they do.
        </div>
        <div className="notice-explain-item">
          <strong>What they want:</strong> Either agree with the addition, or explain why the income
          was not reported — for example, it was already included under a different head.
        </div>
        <div className="notice-explain-item">
          <strong>If you ignore it:</strong> The adjustment is made automatically after 30 days and
          your refund is reduced.
        </div>
      </div>
    </div>

    <div className="notice-summary-grid">
      <div className="notice-summary-card">
        <span className="notice-summary-label">Notice type</span>
        <strong className="notice-summary-val">Section 143(1)(a)</strong>
      </div>

      <div className="notice-summary-card">
        <span className="notice-summary-label">Response due</span>
        <strong className="notice-summary-val">17 Sep 2026 · 15 days left</strong>
      </div>

      <div className="notice-summary-card">
        <span className="notice-summary-label">Risk level</span>
        <strong className="notice-summary-val" style={{ color: '#1e3a8a' }}>
          Low — routine mismatch
        </strong>
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 3: Dynamic Checklist
   ========================================================= */
interface ChecklistRowProps {
  doc: NoticeUploadItem
  isUploaded: boolean
  fileInfo?: UploadedFileInfo
  onFileSelect: (file: File) => void
  onRemoveDoc: () => void
}

const NoticeChecklistRow = ({
  doc,
  isUploaded,
  fileInfo,
  onFileSelect,
  onRemoveDoc,
}: ChecklistRowProps) => {
  const rowInputRef = useRef<HTMLInputElement>(null)

  const handleRowFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFileSelect(f)
    e.target.value = ''
  }

  return (
    <div className={`notice-upload-row ${isUploaded ? 'notice-upload-row--done' : ''}`}>
      <input type="file" ref={rowInputRef} style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png" onChange={handleRowFileChange} aria-label={`Upload ${doc.title}`} />
      <div className="notice-upload-row-left">
        <div className="notice-upload-icon">{isUploaded ? '✓' : '↑'}</div>
        <div>
          <div className="notice-upload-name">{doc.title}</div>
          {fileInfo ? (
            <div className="notice-uploaded-file-meta">
              <span className="notice-uploaded-filename">📄 {fileInfo.name}</span>
              <span className="notice-uploaded-filesize">({fileInfo.size})</span>
            </div>
          ) : (
            <div className="notice-upload-formats">{doc.formats}</div>
          )}
        </div>
      </div>
      <div className="notice-upload-actions">
        {fileInfo && (
          <button type="button" className="notice-upload-remove-btn" onClick={onRemoveDoc} title="Remove file" aria-label={`Remove ${doc.title}`}>
            ✕
          </button>
        )}
        <button type="button" className={`notice-upload-btn ${isUploaded ? 'notice-upload-btn--done' : ''}`} onClick={() => rowInputRef.current?.click()}>
          {isUploaded ? '✓ Uploaded' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export interface Step3Props {
  uploadedDocs: Record<string, boolean>
  uploadedFiles: Record<string, UploadedFileInfo>
  onFileSelect: (id: string, file: File) => void
  onRemoveDoc: (id: string) => void
  explanation: string
  setExplanation: (val: string) => void
  checklistError?: string
}

export const NoticeStep3View = ({
  uploadedDocs,
  uploadedFiles,
  onFileSelect,
  onRemoveDoc,
  explanation,
  setExplanation,
  checklistError,
}: Step3Props) => {
  const uploadedCount = NOTICE_CHECKLIST_DOCS.filter((d) => uploadedDocs[d.id]).length

  return (
    <>
      <div>
        <h2 className="notice-flow-card-heading">We need a few more details to respond</h2>
        <p className="notice-flow-card-subheading">
          This checklist is built from what this specific notice asks for — nothing more.
        </p>
      </div>

      <div className="notice-checklist-meta">
        <span className="notice-checklist-count">{uploadedCount} of 4 uploaded</span>
        <span className="notice-checklist-badge">● Dynamic checklist · Section 143(1)(a)</span>
      </div>

      {checklistError && (
        <div className="notice-validation-error-box">
          <span className="notice-validation-error-icon">⚠️</span>
          <span className="notice-validation-error-text">{checklistError}</span>
        </div>
      )}

      <div className="notice-upload-list">
        {NOTICE_CHECKLIST_DOCS.map((doc: NoticeUploadItem) => {
          const isUploaded = Boolean(uploadedDocs[doc.id])
          const fileInfo = uploadedFiles[doc.id]
          return (
            <NoticeChecklistRow
              key={doc.id}
              doc={doc}
              isUploaded={isUploaded}
              fileInfo={fileInfo}
              onFileSelect={(file) => onFileSelect(doc.id, file)}
              onRemoveDoc={() => onRemoveDoc(doc.id)}
            />
          )
        })}
      </div>

      <div className="notice-input-group">
        <label className="notice-input-label">
          Was this interest income reported anywhere else on your return?
        </label>
        <textarea
          className="notice-text-input notice-textarea"
          placeholder="If yes, tell us where — it usually resolves the notice outright"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </div>

      <div className="notice-notice-box notice-notice-box--blue">
        <div className="notice-notice-title">Different notice, different list</div>
        <div className="notice-notice-desc">
          ⓘ A 139(9) defective-return notice or a scrutiny notice would generate a completely
          different checklist here.
        </div>
      </div>
    </>
  )
}

/* =========================================================
   Screen 4: Review Draft Response Letter
   ========================================================= */
export interface Step4Props {
  onRequestChanges: () => void
  onApproveAndSubmit: () => void
}

export const NoticeStep4View = ({
  onRequestChanges,
  onApproveAndSubmit,
}: Step4Props) => (
  <>
    <div>
      <h2 className="notice-flow-card-heading">Please review our response before we submit it</h2>
      <p className="notice-flow-card-subheading">
        Nothing is sent to the department on your behalf without your approval.
      </p>
    </div>

    <div className="notice-draft-letter-card">
      <p style={{ margin: '0 0 1rem 0', fontWeight: 600 }}>Respected Sir/Madam,</p>
      <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6 }}>
        With reference to the intimation under section 143(1)(a) bearing number
        CPC/2526/A3/284419260 dated 18 August 2026, we respectfully submit the following response
        on behalf of the assessee, Ms Anjali Deshmukh (PAN AXTPD4419K), for Assessment Year 2025-26.
      </p>
      <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6 }}>
        The proposed adjustment relates to interest income of ₹42,000 reflected in the Annual
        Information Statement. The assessee confirms that this interest was received and that it was
        inadvertently omitted from Schedule OS of the return.
      </p>
      <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6 }}>
        The assessee therefore agrees with the proposed adjustment. The resulting additional tax of
        ₹8,736 including cess has been paid vide challan dated 1 September 2026, a copy of which is
        enclosed.
      </p>
      <p style={{ margin: '0 0 1.25rem 0', lineHeight: 1.6 }}>
        We request that the return be processed accordingly.
      </p>
      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>Yours faithfully,</p>
      <p style={{ margin: '0 0 0.2rem 0', color: '#1e3a8a', fontWeight: 700 }}>
        For TaxEdge Fin Solutions
      </p>
      <p style={{ margin: 0, color: '#64748b' }}>Meera Iyer, Tax Executive</p>
    </div>

    <div className="notice-draft-actions">
      <button type="button" className="notice-btn-outline" onClick={onRequestChanges}>
        Request changes
      </button>
      <button type="button" className="notice-btn-primary" onClick={onApproveAndSubmit}>
        Approve &amp; submit →
      </button>
    </div>
  </>
)

/* =========================================================
   Screen 5: Notice Status Pipeline
   ========================================================= */
export const NoticeStep5View = () => (
  <>
    <div>
      <h2 className="notice-flow-card-heading">Notice response status</h2>
      <p className="notice-flow-card-subheading">
        You are notified when the department closes the notice — no need to follow up.
      </p>
    </div>

    {/* Pipeline */}
    <div className="notice-status-pipeline">
      <span className="notice-pipeline-item notice-pipeline-item--done">● Draft</span>
      <span className="notice-pipeline-divider">—</span>
      <span className="notice-pipeline-item notice-pipeline-item--done">● Under review</span>
      <span className="notice-pipeline-divider">—</span>
      <span className="notice-pipeline-item notice-pipeline-item--active">◉ Response submitted</span>
      <span className="notice-pipeline-divider">—</span>
      <span className="notice-pipeline-item">○ Resolved</span>
    </div>

    {/* Details Box */}
    <div className="notice-status-card">
      <div className="notice-status-row"><span>Notice number</span><strong>CPC/2526/A3/284419260</strong></div>
      <div className="notice-status-row"><span>Section</span><strong>143(1)(a)</strong></div>
      <div className="notice-status-row"><span>Response submitted</span><strong>2 Sep 2026</strong></div>
      <div className="notice-status-row"><span>Acknowledgement</span><strong style={{ color: '#ea580c' }}>RSP284419260902</strong></div>
      <div className="notice-status-row"><span>Handled by</span><strong style={{ color: '#1e3a8a' }}>Meera Iyer · Tax Executive</strong></div>
    </div>

    {/* 15-30 days notice box */}
    <div className="notice-notice-box notice-notice-box--blue">
      <div className="notice-notice-title">Typically 15–30 days</div>
      <div className="notice-notice-desc">
        ⓘ The department reviews the response and either closes the notice or asks a follow-up
        question. Either way, you get a notification.
      </div>
    </div>
  </>
)
