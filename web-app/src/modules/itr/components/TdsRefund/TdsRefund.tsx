import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import {
  validateItrUploadFile,
  type ItrUploadedFile,
} from '../../validation/itrUploadValidation'
import {
  TDS_STEPS_METADATA,
  TDS_DOCUMENTS_CHECKLIST,
  type TdsStepMeta,
} from './TdsRefund'
import {
  TdsStep1View,
  TdsStep2View,
  TdsStep3View,
  TdsStep4View,
  TdsStep5View,
} from './TdsRefundSteps'
import './TdsRefund.css'

export const TdsRefund = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)
  const [currentStep, setCurrentStep] = useState(1)

  // Document checklist state (Screen 2)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    pan: false,
    form16: false,
    form16a: false,
    ais: false,
    tis: false,
    bank_details: false,
    previous_itr: false,
    tds_details: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, ItrUploadedFile>>({})
  const [uploadError, setUploadError] = useState('')

  // Payment state (Screen 4)
  const [selectedPaymentId, setSelectedPaymentId] = useState('upi')

  const activeMeta: TdsStepMeta =
    TDS_STEPS_METADATA.filter((s) => s.stepNumber === currentStep)[0] ||
    TDS_STEPS_METADATA[0]

  const handleFileSelect = (id: string, file: File) => {
    const res = validateItrUploadFile(file, 10)
    if (!res.isValid || !res.fileInfo) {
      setUploadError(res.error || 'Invalid file')
      pushToast(res.error || 'Invalid file', 'error')
      return
    }

    setUploadedFiles((prev) => ({ ...prev, [id]: res.fileInfo! }))
    setUploadedDocs((prev) => ({ ...prev, [id]: true }))
    setUploadError('')
    pushToast(`"${file.name}" uploaded successfully!`, 'success')
  }

  const handleRemoveDoc = (id: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setUploadedDocs((prev) => ({ ...prev, [id]: false }))
    pushToast('Document removed', 'info')
  }

  const handleNextStep = () => {
    // Screen 2 validation: Require at least one uploaded document
    if (currentStep === 2) {
      const uploadedCount = TDS_DOCUMENTS_CHECKLIST.filter((d) => uploadedDocs[d.id]).length
      if (uploadedCount === 0) {
        const msg = 'Please upload at least one tax document (e.g. Form 16, 16A or Bank statement) to continue.'
        setUploadError(msg)
        pushToast('At least 1 document upload is required', 'error')
        return
      }
      setUploadError('')
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(routePaths.itr.root)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(routePaths.itr.root)
    }
  }

  return (
    <div className="tds-refund-flow-page">
      {/* 1. Top Meta & Stepper */}
      <div className="tds-flow-topbar">
        <div className="tds-flow-top-meta">
          <span className="tds-flow-section-tag">SECTION 3 · TDS REFUND</span>
          <span className="tds-flow-doc-badge">Documented in original requirements</span>
        </div>

        <div className="tds-flow-title-row">
          <h1 className="tds-flow-screen-title">Screen {currentStep} of 5</h1>
          <div className="tds-flow-stepper">
            {TDS_STEPS_METADATA.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                className={`tds-flow-step-pill ${
                  s.stepNumber === currentStep
                    ? 'tds-flow-step-pill--active'
                    : s.stepNumber < currentStep
                      ? 'tds-flow-step-pill--completed'
                      : ''
                }`}
                onClick={() => setCurrentStep(s.stepNumber)}
                aria-label={`Jump to Screen ${s.stepNumber}`}
              >
                {s.stepNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="tds-flow-layout">
        {/* Left Column: Screen Main Card */}
        <div className="tds-flow-main-card">
          <span className="tds-card-header-label">WHAT THE CUSTOMER SEES</span>

          {currentStep === 1 && <TdsStep1View />}

          {currentStep === 2 && (
            <TdsStep2View
              uploadedDocs={uploadedDocs}
              uploadedFiles={uploadedFiles}
              onFileSelect={handleFileSelect}
              onRemoveDoc={handleRemoveDoc}
              uploadError={uploadError}
            />
          )}

          {currentStep === 3 && (
            <TdsStep3View
              onConfirm={() => setCurrentStep(4)}
              onCancel={() => navigate(routePaths.itr.root)}
            />
          )}

          {currentStep === 4 && (
            <TdsStep4View
              selectedPaymentId={selectedPaymentId}
              onSelectPayment={setSelectedPaymentId}
              onPayFee={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && <TdsStep5View />}

          {/* Bottom Action Bar */}
          <div className="tds-flow-bottom-bar">
            <button
              type="button"
              className="tds-bottom-back-btn"
              onClick={handlePrevStep}
            >
              ← Back
            </button>

            <button
              type="button"
              className="tds-bottom-next-btn"
              onClick={handleNextStep}
            >
              {currentStep < 5 ? 'Next →' : 'Finish flow ✓'}
            </button>
          </div>
        </div>

        {/* Right Column: Side Explanatory Panel */}
        <aside className="tds-flow-side-panel">
          <div className="tds-side-card">
            <div className="tds-side-card-tag">WHAT THE CUSTOMER SEES</div>
            <p className="tds-side-card-text">{activeMeta.customerSees}</p>
          </div>

          <div className="tds-side-card">
            <div className="tds-side-card-tag">WHAT HAPPENS NEXT</div>
            <p className="tds-side-card-text">{activeMeta.happensNext}</p>
          </div>

          <div className="tds-side-card">
            <div className="tds-side-card-title">Flow</div>
            <div className="tds-flow-list">
              {TDS_STEPS_METADATA.map((s) => (
                <div
                  key={s.stepNumber}
                  className={`tds-flow-item ${
                    s.stepNumber === currentStep ? 'tds-flow-item--active' : ''
                  }`}
                  onClick={() => setCurrentStep(s.stepNumber)}
                >
                  <span className="tds-flow-num">{s.stepNumber}</span>
                  <span>{s.flowLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default TdsRefund
