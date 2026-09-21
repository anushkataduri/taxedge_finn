import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import type { ItrUploadedFile } from '../../validation/itrUploadValidation'
import {
  ASSESSMENT_YEAR_OPTIONS,
  PREV_YEAR_DOCUMENTS,
  type AssessmentYearItem,
} from './PreviousYearItr'

/* =========================================================
   Screen 1: Select Assessment Year
   ========================================================= */
export interface Step1Props {
  selectedAY: string
  onSelectAY: (ay: string) => void
}

export const PrevYearStep1View = ({ selectedAY, onSelectAY }: Step1Props) => (
  <>
    <div>
      <h2 className="prev-flow-card-heading">Which year would you like to file for?</h2>
      <p className="prev-flow-card-subheading">
        We only show years the department will still accept a return for.
      </p>
    </div>

    <div className="prev-ay-list">
      {ASSESSMENT_YEAR_OPTIONS.map((item: AssessmentYearItem) => {
        const isSelected = item.ay === selectedAY
        const isDisabled = !item.isEligible
        return (
          <div
            key={item.ay}
            className={`prev-ay-card ${
              isDisabled ? 'prev-ay-card--disabled' : ''
            } ${isSelected ? 'prev-ay-card--selected' : ''}`}
            onClick={() => {
              if (!isDisabled) onSelectAY(item.ay)
            }}
          >
            <div className="prev-ay-card-left">
              <div className="prev-ay-icon">📅</div>
              <div>
                <div className="prev-ay-title">{item.ay}</div>
                <div className="prev-ay-sub">{item.subtitle}</div>
              </div>
            </div>

            <span
              className={`prev-ay-badge ${
                item.status === 'Eligible' ? 'prev-ay-badge--eligible' : 'prev-ay-badge--closed'
              }`}
            >
              ● {item.status}
            </span>
          </div>
        )
      })}
    </div>

    <div className="prev-notice-box prev-notice-box--blue">
      <div className="prev-notice-title">Eligibility is a legal rule, not a preference</div>
      <div className="prev-notice-desc">
        ⓘ The list is filtered by the department's filing windows, so a customer cannot start a
        request that would be rejected.
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 2: Same questions, earlier year
   ========================================================= */
export interface Step2Props {
  selectedAY: string
}

export const PrevYearStep2View = ({ selectedAY }: Step2Props) => {
  const navigate = useNavigate()

  return (
    <>
      <div>
        <div className="prev-belated-pill">● Belated Return for {selectedAY}</div>
        <h2 className="prev-flow-card-heading">Same questions, earlier year</h2>
        <p className="prev-flow-card-subheading">
          Income type, income details and deductions — identical to Screens 1–3 of regular ITR
          Filing, just labelled for {selectedAY}.
        </p>
      </div>

      <div className="prev-substeps-list">
        <div className="prev-substep-card">
          <div className="prev-substep-left">
            <div className="prev-substep-icon">📄</div>
            <div>
              <div className="prev-substep-title">Screen 1 — Income type</div>
              <div className="prev-substep-sub">
                Salaried, Business, Professional, Freelancer, Trader/Investor, Rental, Capital Gains,
                Multiple
              </div>
            </div>
          </div>
          <button
            type="button"
            className="prev-substep-btn"
            onClick={() => navigate(routePaths.itr.itrFiling)}
          >
            Open in ITR Filing →
          </button>
        </div>

        <div className="prev-substep-card">
          <div className="prev-substep-left">
            <div className="prev-substep-icon">📄</div>
            <div>
              <div className="prev-substep-title">Screen 2 — Income details</div>
              <div className="prev-substep-sub">
                PAN, Aadhaar and only the fields relevant to the income type chosen
              </div>
            </div>
          </div>
          <button
            type="button"
            className="prev-substep-btn"
            onClick={() => navigate(routePaths.itr.itrFiling)}
          >
            Open in ITR Filing →
          </button>
        </div>

        <div className="prev-substep-card">
          <div className="prev-substep-left">
            <div className="prev-substep-icon">📄</div>
            <div>
              <div className="prev-substep-title">Screen 3 — Deductions</div>
              <div className="prev-substep-sub">
                80C, insurance, home loan interest, education loan interest and others
              </div>
            </div>
          </div>
          <button
            type="button"
            className="prev-substep-btn"
            onClick={() => navigate(routePaths.itr.itrFiling)}
          >
            Open in ITR Filing →
          </button>
        </div>
      </div>

      <div className="prev-notice-box prev-notice-box--tint">
        <div className="prev-notice-title" style={{ color: '#1e3a8a' }}>Reuse, don't rebuild</div>
        <div className="prev-notice-desc" style={{ color: '#475569' }}>
          ⓘ These are the same three screens as Section 2 with a different header label — one
          component, two entry points.
        </div>
      </div>
    </>
  )
}

/* =========================================================
   Screen 3: Late Fee and Interest Breakdown
   ========================================================= */
export interface Step3Props {
  selectedAY: string
}

export const PrevYearStep3View = ({ selectedAY }: Step3Props) => (
  <>
    <div>
      <h2 className="prev-flow-card-heading">
        Since this is a late filing, a late fee and interest may apply
      </h2>
      <p className="prev-flow-card-subheading">
        This is charged by the government and is separate from our service fee.
      </p>
    </div>

    <div className="prev-fees-grid">
      {/* Left Card: Govt Charges */}
      <div className="prev-fee-card">
        <div className="prev-fee-card-title">Government charges (estimated)</div>
        <div className="prev-fee-row">
          <span>Late filing fee — Sec 234F</span>
          <strong>₹5,000</strong>
        </div>
        <div className="prev-fee-row">
          <span>Interest — Sec 234A</span>
          <strong>₹3,240</strong>
        </div>
        <div className="prev-fee-row">
          <span>Additional tax — ITR-U</span>
          <strong>₹7,800</strong>
        </div>
        <div className="prev-fee-row prev-fee-row--total">
          <span>Payable to department</span>
          <span className="prev-fee-total-blue">₹16,040</span>
        </div>
      </div>

      {/* Right Card: TaxEdge Service Fee */}
      <div className="prev-fee-card">
        <div className="prev-fee-card-title">TaxEdge service fee</div>
        <div className="prev-fee-row">
          <span>Previous Year ITR</span>
          <strong>₹3,500</strong>
        </div>
        <div className="prev-fee-row">
          <span>GST @ 18%</span>
          <strong>₹630</strong>
        </div>
        <div className="prev-fee-row prev-fee-row--total">
          <span>Payable to TaxEdge</span>
          <span className="prev-fee-total-orange">₹4,130</span>
        </div>
        <div className="prev-fee-footnote">
          Two separate payments. The government charges go to the department, not to us.
        </div>
      </div>
    </div>

    <div className="prev-notice-box prev-notice-box--amber">
      <div className="prev-notice-title" style={{ color: '#b45309' }}>
        Estimate pending staff calculation
      </div>
      <div className="prev-notice-desc" style={{ color: '#92400e' }}>
        ⚠️ The exact late fee and interest are confirmed by your Tax Executive once your documents
        are verified. The figures above are indicative for {selectedAY}.
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 4: Documents and submission
   ========================================================= */
interface PrevChecklistRowProps {
  doc: { id: string; name: string; formats: string }
  isUploaded: boolean
  fileInfo?: ItrUploadedFile
  onFileSelect: (file: File) => void
  onRemoveDoc: () => void
}

const PrevChecklistRow = ({
  doc,
  isUploaded,
  fileInfo,
  onFileSelect,
  onRemoveDoc,
}: PrevChecklistRowProps) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className={`prev-upload-row ${isUploaded ? 'prev-upload-row--done' : ''}`}>
      <input
        type="file"
        ref={ref}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(f)
          e.target.value = ''
        }}
        aria-label={`Upload ${doc.name}`}
      />
      <div className="prev-upload-row-left">
        <div className="prev-upload-icon">{isUploaded ? '✓' : '↑'}</div>
        <div>
          <div className="prev-upload-name">{doc.name}</div>
          {fileInfo ? (
            <div className="prev-uploaded-file-meta">
              <span className="prev-uploaded-filename">📄 {fileInfo.name}</span>
              <span className="prev-uploaded-filesize">({fileInfo.size})</span>
            </div>
          ) : (
            <div className="prev-upload-formats">{doc.formats}</div>
          )}
        </div>
      </div>
      <div className="prev-upload-actions">
        {fileInfo && (
          <button
            type="button"
            className="prev-upload-remove-btn"
            onClick={onRemoveDoc}
            title="Remove file"
            aria-label={`Remove ${doc.name}`}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className={`prev-upload-btn ${isUploaded ? 'prev-upload-btn--done' : ''}`}
          onClick={() => ref.current?.click()}
        >
          {isUploaded ? '✓ Uploaded' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export interface Step4Props {
  uploadedDocs: Record<string, boolean>
  uploadedFiles: Record<string, ItrUploadedFile>
  onFileSelect: (id: string, file: File) => void
  onRemoveDoc: (id: string) => void
  uploadError?: string
}

export const PrevYearStep4View = ({
  uploadedDocs,
  uploadedFiles,
  onFileSelect,
  onRemoveDoc,
  uploadError,
}: Step4Props) => {
  const uploadedCount = PREV_YEAR_DOCUMENTS.filter((d) => uploadedDocs[d.id]).length

  return (
    <>
      <div>
        <h2 className="prev-flow-card-heading">Documents and submission</h2>
        <p className="prev-flow-card-subheading">
          The same checklist, confirmation and tracker as regular ITR Filing.
        </p>
      </div>

      <div className="prev-docs-meta">{uploadedCount} of 6 uploaded</div>

      {uploadError && (
        <div className="prev-validation-error-box">
          <span className="prev-validation-error-icon">⚠️</span>
          <span className="prev-validation-error-text">{uploadError}</span>
        </div>
      )}

      <div className="prev-upload-list">
        {PREV_YEAR_DOCUMENTS.map((doc) => {
          const isUploaded = Boolean(uploadedDocs[doc.id])
          const fileInfo = uploadedFiles[doc.id]
          return (
            <PrevChecklistRow
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

      <div className="prev-check-circle-wrapper">
        <div className="prev-check-circle">✓</div>
      </div>
    </>
  )
}
