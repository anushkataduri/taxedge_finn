import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import {
  validateItrUploadFile,
  type ItrUploadedFile,
} from '../../validation/itrUploadValidation'
import {
  PREV_YEAR_STEPS_METADATA,
  PREV_YEAR_DOCUMENTS,
  type PrevYearStepMeta,
} from './PreviousYearItr'
import {
  PrevYearStep1View,
  PrevYearStep2View,
  PrevYearStep3View,
  PrevYearStep4View,
} from './PreviousYearItrSteps'
import './PreviousYearItr.css'

export const PreviousYearItr = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAY, setSelectedAY] = useState('AY 2023-24')

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    pan: false,
    aadhaar: false,
    form16: false,
    ais_tis: false,
    bank_statements: false,
    investment_proofs: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, ItrUploadedFile>>({})
  const [uploadError, setUploadError] = useState('')

  const activeMeta: PrevYearStepMeta =
    PREV_YEAR_STEPS_METADATA.filter((s) => s.stepNumber === currentStep)[0] ||
    PREV_YEAR_STEPS_METADATA[0]

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
    // Screen 4 validation: Require at least one uploaded document before completing
    if (currentStep === 4) {
      const uploadedCount = PREV_YEAR_DOCUMENTS.filter((d) => uploadedDocs[d.id]).length
      if (uploadedCount === 0) {
        const msg = 'Please upload at least one earlier year document (e.g. Form 16, AIS, or Bank Statement) to complete.'
        setUploadError(msg)
        pushToast('At least 1 document upload is required', 'error')
        return
      }
      setUploadError('')
    }

    if (currentStep < 4) {
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
    <div className="prev-year-flow-page">
      {/* 1. Top Meta & Stepper */}
      <div className="prev-flow-topbar">
        <div className="prev-flow-top-meta">
          <span className="prev-flow-section-tag">SECTION 4 · PREVIOUS YEAR ITR</span>
          <span className="prev-flow-doc-badge">Recommended design — confirm with client</span>
        </div>

        <div className="prev-flow-title-row">
          <h1 className="prev-flow-screen-title">Screen {currentStep} of 4</h1>
          <div className="prev-flow-stepper">
            {PREV_YEAR_STEPS_METADATA.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                className={`prev-flow-step-pill ${
                  s.stepNumber === currentStep
                    ? 'prev-flow-step-pill--active'
                    : s.stepNumber < currentStep
                      ? 'prev-flow-step-pill--completed'
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

        {/* Top Note Box (Screen 1 only) */}
        {currentStep === 1 && (
          <div className="prev-top-note-box">
            <div className="prev-top-note-header">
              <span className="prev-top-note-icon">⚠️</span>
              <strong className="prev-top-note-title">Note</strong>
            </div>
            <p className="prev-top-note-text">
              This sub-service was listed by name in the requirements but not described in detail.
              The flow below follows standard practice for filing a return for a past (missed)
              assessment year, and should be reviewed with the client before development.
            </p>
          </div>
        )}
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="prev-flow-layout">
        {/* Left Column: Main Card */}
        <div className="prev-flow-main-card">
          <span className="prev-card-header-label">WHAT THE CUSTOMER SEES</span>

          {currentStep === 1 && (
            <PrevYearStep1View selectedAY={selectedAY} onSelectAY={setSelectedAY} />
          )}

          {currentStep === 2 && <PrevYearStep2View selectedAY={selectedAY} />}

          {currentStep === 3 && <PrevYearStep3View selectedAY={selectedAY} />}

          {currentStep === 4 && (
            <PrevYearStep4View
              uploadedDocs={uploadedDocs}
              uploadedFiles={uploadedFiles}
              onFileSelect={handleFileSelect}
              onRemoveDoc={handleRemoveDoc}
              uploadError={uploadError}
            />
          )}

          {/* Bottom Action Bar */}
          <div className="prev-flow-bottom-bar">
            <button
              type="button"
              className="prev-bottom-back-btn"
              onClick={handlePrevStep}
            >
              ← Back
            </button>

            <button
              type="button"
              className="prev-bottom-next-btn"
              onClick={handleNextStep}
            >
              {currentStep < 4 ? 'Next →' : 'Finish flow ✓'}
            </button>
          </div>
        </div>

        {/* Right Column: Side Explanatory Panel */}
        <aside className="prev-flow-side-panel">
          <div className="prev-side-card">
            <div className="prev-side-card-tag">WHAT THE CUSTOMER SEES</div>
            <p className="prev-side-card-text">{activeMeta.customerSees}</p>
          </div>

          <div className="prev-side-card">
            <div className="prev-side-card-tag">WHAT HAPPENS NEXT</div>
            <p className="prev-side-card-text">{activeMeta.happensNext}</p>
          </div>

          <div className="prev-side-card">
            <div className="prev-side-card-title">Flow</div>
            <div className="prev-flow-list">
              {PREV_YEAR_STEPS_METADATA.map((s) => (
                <div
                  key={s.stepNumber}
                  className={`prev-flow-item ${
                    s.stepNumber === currentStep ? 'prev-flow-item--active' : ''
                  }`}
                  onClick={() => setCurrentStep(s.stepNumber)}
                >
                  <span className="prev-flow-num">{s.stepNumber}</span>
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

export default PreviousYearItr
