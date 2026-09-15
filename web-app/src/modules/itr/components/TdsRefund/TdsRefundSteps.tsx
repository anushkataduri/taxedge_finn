import { useRef } from 'react'
import type { ItrUploadedFile } from '../../validation/itrUploadValidation'
import {
  TDS_DOCUMENTS_CHECKLIST,
  TDS_PAYMENT_METHODS,
  type TdsPaymentMethod,
} from './TdsRefund'
import {
  RupeeIcon,
  UploadIcon,
  CheckIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CreditCardIcon,
  BankIcon,
  MailIcon,
} from '../ItrIcons'

/* =========================================================
   Screen 1: Intro / 3-Step Overview
   ========================================================= */
export const TdsStep1View = () => (
  <>
    <div>
      <h2 className="tds-flow-card-heading">We’ll estimate your TDS refund</h2>
      <p className="tds-flow-card-subheading">
        Our fee is 15% of the refund amount — you only pay if you proceed.
      </p>
    </div>

    <div className="tds-intro-grid">
      <div className="tds-intro-card">
        <div className="tds-intro-card-num">1</div>
        <div className="tds-intro-card-title">You upload</div>
        <div className="tds-intro-card-desc">
          PAN, Form 16 / 16A, AIS, TIS and bank details
        </div>
      </div>

      <div className="tds-intro-card">
        <div className="tds-intro-card-num">2</div>
        <div className="tds-intro-card-title">We estimate</div>
        <div className="tds-intro-card-desc">
          A Tax Executive reconciles it and gives you an exact figure
        </div>
      </div>

      <div className="tds-intro-card">
        <div className="tds-intro-card-num">3</div>
        <div className="tds-intro-card-title">You decide</div>
        <div className="tds-intro-card-desc">
          Confirm and pay only if you are happy with the number
        </div>
      </div>
    </div>

    <div className="tds-no-fee-banner">
      <div className="tds-no-fee-icon">
        <RupeeIcon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <div className="tds-no-fee-title">No refund, no fee</div>
        <div className="tds-no-fee-desc">
          The 15% is charged on the refund actually recovered. If there is no refund to claim,
          there is nothing to pay.
        </div>
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 2: Document Checklist
   ========================================================= */
interface TdsChecklistRowProps {
  doc: { id: string; name: string; formats: string }
  isUploaded: boolean
  fileInfo?: ItrUploadedFile
  onFileSelect: (file: File) => void
  onRemoveDoc: () => void
}

const TdsChecklistRow = ({
  doc,
  isUploaded,
  fileInfo,
  onFileSelect,
  onRemoveDoc,
}: TdsChecklistRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={`tds-upload-row ${isUploaded ? 'tds-upload-row--done' : ''}`}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
          e.target.value = ''
        }}
        aria-label={`Upload ${doc.name}`}
      />
      <div className="tds-upload-row-left">
        <div className="tds-upload-icon">
          {isUploaded ? <CheckIcon size={16} strokeWidth={2.5} /> : <UploadIcon size={16} strokeWidth={2.5} />}
        </div>
        <div>
          <div className="tds-upload-name">{doc.name}</div>
          {fileInfo ? (
            <div className="tds-uploaded-file-meta">
              <span className="tds-uploaded-filename">
                <FileTextIcon size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                {fileInfo.name}
              </span>
              <span className="tds-uploaded-filesize">({fileInfo.size})</span>
            </div>
          ) : (
            <div className="tds-upload-formats">{doc.formats}</div>
          )}
        </div>
      </div>
      <div className="tds-upload-actions">
        {fileInfo && (
          <button
            type="button"
            className="tds-upload-remove-btn"
            onClick={onRemoveDoc}
            title="Remove document"
            aria-label={`Remove ${doc.name}`}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className={`tds-upload-btn ${isUploaded ? 'tds-upload-btn--done' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploaded ? '✓ Uploaded' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export interface Step2Props {
  uploadedDocs: Record<string, boolean>
  uploadedFiles: Record<string, ItrUploadedFile>
  onFileSelect: (id: string, file: File) => void
  onRemoveDoc: (id: string) => void
  uploadError?: string
}

export const TdsStep2View = ({
  uploadedDocs,
  uploadedFiles,
  onFileSelect,
  onRemoveDoc,
  uploadError,
}: Step2Props) => {
  const uploadedCount = TDS_DOCUMENTS_CHECKLIST.filter((d) => uploadedDocs[d.id]).length

  return (
    <>
      <div>
        <h2 className="tds-flow-card-heading">Your document checklist</h2>
        <p className="tds-flow-card-subheading">
          These are what our staff use to calculate your refund estimate.
        </p>
      </div>

      <div className="tds-checklist-meta">
        <span className="tds-checklist-count">{uploadedCount} of 8 uploaded</span>
        <span className="tds-checklist-status-badge">● In progress</span>
      </div>

      {uploadError && (
        <div className="tds-validation-error-box">
          <span className="tds-validation-error-icon">
            <AlertTriangleIcon size={16} strokeWidth={2} />
          </span>
          <span className="tds-validation-error-text">{uploadError}</span>
        </div>
      )}

      <div className="tds-upload-list">
        {TDS_DOCUMENTS_CHECKLIST.map((doc) => {
          const isUploaded = Boolean(uploadedDocs[doc.id])
          const fileInfo = uploadedFiles[doc.id]
          return (
            <TdsChecklistRow
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
    </>
  )
}

/* =========================================================
   Screen 3: Estimate Breakdown
   ========================================================= */
export interface Step3Props {
  onConfirm: () => void
  onCancel: () => void
}

export const TdsStep3View = ({ onConfirm, onCancel }: Step3Props) => (
  <>
    <div>
      <h2 className="tds-flow-card-heading">Here is your estimate</h2>
      <p className="tds-flow-card-subheading">
        You see the exact numbers before committing to anything.
      </p>
    </div>

    <div className="tds-estimate-grid">
      <div className="tds-estimate-hero-card">
        <div className="tds-estimate-hero-label">YOUR ESTIMATED REFUND</div>
        <div className="tds-estimate-hero-val">₹23,400</div>
        <div className="tds-estimate-hero-sub">Based on the documents you uploaded</div>
      </div>

      <div className="tds-estimate-breakdown-card">
        <div className="tds-breakdown-row">
          <span>Total TDS deducted</span>
          <strong>₹46,800</strong>
        </div>
        <div className="tds-breakdown-row">
          <span>Tax actually payable</span>
          <strong>₹23,400</strong>
        </div>
        <div className="tds-breakdown-row">
          <span>Estimated refund</span>
          <strong>₹23,400</strong>
        </div>
        <div className="tds-breakdown-row tds-breakdown-row--fee">
          <span style={{ fontWeight: 800, color: '#0f172a' }}>Our fee (15%)</span>
          <span style={{ fontWeight: 800, color: '#ea580c', fontSize: '1.15rem' }}>₹3,510</span>
        </div>
      </div>
    </div>

    <div className="tds-estimate-actions">
      <button type="button" className="tds-btn-outline" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" className="tds-btn-primary" onClick={onConfirm}>
        Confirm — proceed →
      </button>
    </div>

    <div className="tds-estimate-disclaimer">
      <div className="tds-disclaimer-title">Estimate, not a guarantee</div>
      <div className="tds-disclaimer-text">
        ⓘ The final refund is decided by the Income Tax Department after processing. Our fee is
        charged on the amount actually recovered.
      </div>
    </div>
  </>
)

/* =========================================================
   Screen 4: Payment of 15% Fee
   ========================================================= */
export interface Step4Props {
  selectedPaymentId: string
  onSelectPayment: (id: string) => void
  onPayFee: () => void
}

export const TdsStep4View = ({
  selectedPaymentId,
  onSelectPayment,
  onPayFee,
}: Step4Props) => {
  const renderPaymentIcon = (icon: string) => {
    switch (icon) {
      case 'card':
        return <CreditCardIcon size={18} strokeWidth={2} />
      case 'bank':
        return <BankIcon size={18} strokeWidth={2} />
      case 'upi':
      default:
        return <RupeeIcon size={18} strokeWidth={2.2} />
    }
  }

  return (
    <>
      <div>
        <h2 className="tds-flow-card-heading">Pay the 15% fee</h2>
        <p className="tds-flow-card-subheading">
          Once paid, your refund claim enters the TDS queue.
        </p>
      </div>

      <div className="tds-payment-layout">
        {/* Payment Options */}
        <div className="tds-payment-options-list">
          {TDS_PAYMENT_METHODS.map((method: TdsPaymentMethod) => {
            const isSelected = method.id === selectedPaymentId
            return (
              <div
                key={method.id}
                className={`tds-payment-card ${isSelected ? 'tds-payment-card--selected' : ''}`}
                onClick={() => onSelectPayment(method.id)}
              >
                <div className="tds-payment-card-left">
                  <div className="tds-payment-icon">{renderPaymentIcon(method.icon)}</div>
                  <div>
                    <div className="tds-payment-name">{method.name}</div>
                    {method.subtitle && (
                      <div className="tds-payment-sub">{method.subtitle}</div>
                    )}
                  </div>
                </div>
                <div className="tds-payment-radio">
                  {isSelected && <div className="tds-payment-radio-dot" />}
                </div>
              </div>
            )
          })}
        </div>

      {/* Fee Summary */}
      <div className="tds-fee-summary-card">
        <div className="tds-fee-summary-title">Fee summary</div>
        <div className="tds-fee-row">
          <span>Refund estimate</span>
          <strong>₹23,400</strong>
        </div>
        <div className="tds-fee-row">
          <span>Our fee (15%)</span>
          <strong>₹3,510</strong>
        </div>
        <div className="tds-fee-row">
          <span>GST @ 18%</span>
          <strong>₹632</strong>
        </div>
        <div className="tds-fee-row tds-fee-row--total">
          <span>Total payable</span>
          <span className="tds-fee-total-val">₹4,142</span>
        </div>
      </div>
    </div>

    <div className="tds-pay-action-wrapper">
      <button type="button" className="tds-pay-now-btn" onClick={onPayFee}>
        Pay ₹4,142 securely
      </button>
    </div>
  </>
  )
}

/* =========================================================
   Screen 5: Status View
   ========================================================= */
export const TdsStep5View = () => (
  <>
    <div>
      <h2 className="tds-flow-card-heading">Your refund status</h2>
      <p className="tds-flow-card-subheading">
        You do not need to check manually — we notify you at each stage.
      </p>
    </div>

    {/* Milestone Tracker */}
    <div className="tds-status-pipeline">
      <span className="tds-pipeline-item tds-pipeline-item--done">● Filed</span>
      <span className="tds-pipeline-divider">—</span>
      <span className="tds-pipeline-item tds-pipeline-item--active">◉ Processing</span>
      <span className="tds-pipeline-divider">—</span>
      <span className="tds-pipeline-item">○ Refund credited</span>
    </div>

    {/* Details Card */}
    <div className="tds-status-card">
      <div className="tds-status-row">
        <span>Application ID</span>
        <strong>ITR-2026-00043</strong>
      </div>
      <div className="tds-status-row">
        <span>Filed on</span>
        <strong>2 Sep 2026</strong>
      </div>
      <div className="tds-status-row">
        <span>Refund claimed</span>
        <strong style={{ color: '#ea580c' }}>₹23,400</strong>
      </div>
      <div className="tds-status-row">
        <span>Credit to</span>
        <strong>HDFC •••• 1826</strong>
      </div>
      <div className="tds-status-row">
        <span>Typical time to credit</span>
        <strong>20–45 days</strong>
      </div>
    </div>

    {/* Notification Alert Box */}
    <div className="tds-notif-box">
      <div className="tds-notif-icon">
        <MailIcon size={20} strokeWidth={2} />
      </div>
      <div>
        <div className="tds-notif-title">You will be notified</div>
        <div className="tds-notif-desc">
          A notification is sent the moment the refund actually reaches your bank account.
        </div>
      </div>
    </div>
  </>
)
