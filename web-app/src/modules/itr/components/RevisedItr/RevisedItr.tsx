import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import {
  validateItrUploadFile,
  type ItrUploadedFile,
} from '../../validation/itrUploadValidation'
import {
  REVISED_STEPS_METADATA,
  type RevisedStepMeta,
} from './RevisedItr'
import {
  RevisedStep1View,
  RevisedStep2View,
  RevisedStep3View,
  RevisedStep4View,
  RevisedStep5View,
} from './RevisedItrSteps'
import './RevisedItr.css'

export const RevisedItr = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)
  const [currentStep, setCurrentStep] = useState(1)

  // Screen 1 states
  const [ackNumber, setAckNumber] = useState('284419250714208')
  const [selectedAY, setSelectedAY] = useState('AY 2025-26')

  // Screen 2 state
  const [selectedReason, setSelectedReason] = useState('missed_income')

  // Screen 3 states (preloaded values)
  const [salaryIncome, setSalaryIncome] = useState('6,18,400')
  const [otherIncome, setOtherIncome] = useState('2,79,280')
  const [deduction80C, setDeduction80C] = useState('1,50,000')
  const [deduction80D, setDeduction80D] = useState('28,000')
  const [homeLoan, setHomeLoan] = useState('1,42,000')
  const [bankAccount, setBankAccount] = useState('HDFC •••• 1826')
  const [ifscCode, setIfscCode] = useState('HDFC0000412')
  const [taxableIncome, setTaxableIncome] = useState('5,17,680')

  // Screen 4 states: File uploads and notes
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, ItrUploadedFile>>({})
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const activeMeta: RevisedStepMeta =
    REVISED_STEPS_METADATA.filter((s) => s.stepNumber === currentStep)[0] ||
    REVISED_STEPS_METADATA[0]

  const handleFileSelect = (id: string, file: File) => {
    const result = validateItrUploadFile(file, 10, ['pdf', 'jpg', 'jpeg', 'png'])
    if (!result.isValid || !result.fileInfo) {
      const msg = result.error || 'Invalid file. Maximum size is 10 MB.'
      setUploadError(msg)
      pushToast(msg, 'error')
      return
    }

    setUploadError(null)
    setUploadedFiles((prev) => ({
      ...prev,
      [id]: result.fileInfo!,
    }))
    pushToast(`"${file.name}" uploaded successfully!`, 'success')
  }

  const handleFileRemove = (id: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    pushToast('Document removed', 'info')
  }

  const handleNextStep = () => {
    if (currentStep === 4) {
      const uploadedCount = Object.keys(uploadedFiles).length
      if (uploadedCount === 0) {
        const errorMsg = 'Please upload at least one supporting document before proceeding.'
        setUploadError(errorMsg)
        pushToast(errorMsg, 'error')
        return
      }
    }
    setUploadError(null)
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(routePaths.itr.root)
    }
  }

  const handlePrevStep = () => {
    setUploadError(null)
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(routePaths.itr.root)
    }
  }

  return (
    <div className="revised-flow-page">
      {/* 1. Top Meta & Stepper */}
      <div className="revised-flow-topbar">
        <div className="revised-flow-top-meta">
          <span className="revised-flow-section-tag">SECTION 5 · REVISED ITR</span>
          <span className="revised-flow-doc-badge">Recommended design — confirm with client</span>
        </div>

        <div className="revised-flow-title-row">
          <h1 className="revised-flow-screen-title">Screen {currentStep} of 5</h1>
          <div className="revised-flow-stepper">
            {REVISED_STEPS_METADATA.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                className={`revised-flow-step-pill ${
                  s.stepNumber === currentStep
                    ? 'revised-flow-step-pill--active'
                    : s.stepNumber < currentStep
                      ? 'revised-flow-step-pill--completed'
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
          <div className="revised-top-note-box">
            <div className="revised-top-note-header">
              <span className="revised-top-note-icon">⚠️</span>
              <strong className="revised-top-note-title">Note</strong>
            </div>
            <p className="revised-top-note-text">
              Also listed by name only in the requirements. The flow below follows standard
              practice for correcting a return that was already filed, and should be confirmed with
              the client before development.
            </p>
          </div>
        )}
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="revised-flow-layout">
        {/* Left Column: Main Card */}
        <div className="revised-flow-main-card">
          <span className="revised-card-header-label">WHAT THE CUSTOMER SEES</span>

          {currentStep === 1 && (
            <RevisedStep1View
              ackNumber={ackNumber}
              setAckNumber={setAckNumber}
              selectedAY={selectedAY}
              setSelectedAY={setSelectedAY}
              onFindReturn={() => alert('Original return fetched from ITD!')}
            />
          )}

          {currentStep === 2 && (
            <RevisedStep2View
              selectedReason={selectedReason}
              onSelectReason={setSelectedReason}
            />
          )}

          {currentStep === 3 && (
            <RevisedStep3View
              salaryIncome={salaryIncome}
              setSalaryIncome={setSalaryIncome}
              otherIncome={otherIncome}
              setOtherIncome={setOtherIncome}
              deduction80C={deduction80C}
              setDeduction80C={setDeduction80C}
              deduction80D={deduction80D}
              setDeduction80D={setDeduction80D}
              homeLoan={homeLoan}
              setHomeLoan={setHomeLoan}
              bankAccount={bankAccount}
              setBankAccount={setBankAccount}
              ifscCode={ifscCode}
              setIfscCode={setIfscCode}
              taxableIncome={taxableIncome}
              setTaxableIncome={setTaxableIncome}
            />
          )}

          {currentStep === 4 && (
            <RevisedStep4View
              uploadedFiles={uploadedFiles}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              uploadError={uploadError}
              notes={notes}
              setNotes={setNotes}
            />
          )}

          {currentStep === 5 && (
            <RevisedStep5View
              selectedAY={selectedAY}
              onRequestChange={() => setCurrentStep(3)}
              onApproveAndFile={() => alert('Revised return submitted for processing!')}
            />
          )}

          {/* Bottom Action Bar */}
          <div className="revised-flow-bottom-bar">
            <button
              type="button"
              className="revised-bottom-back-btn"
              onClick={handlePrevStep}
            >
              ← Back
            </button>

            <button
              type="button"
              className="revised-bottom-next-btn"
              onClick={handleNextStep}
            >
              {currentStep < 5 ? 'Next →' : 'Finish flow ✓'}
            </button>
          </div>
        </div>

        {/* Right Column: Side Explanatory Panel */}
        <aside className="revised-flow-side-panel">
          <div className="revised-side-card">
            <div className="revised-side-card-tag">WHAT THE CUSTOMER SEES</div>
            <p className="revised-side-card-text">{activeMeta.customerSees}</p>
          </div>

          <div className="revised-side-card">
            <div className="revised-side-card-tag">WHAT HAPPENS NEXT</div>
            <p className="revised-side-card-text">{activeMeta.happensNext}</p>
          </div>

          <div className="revised-side-card">
            <div className="revised-side-card-title">Flow</div>
            <div className="revised-flow-list">
              {REVISED_STEPS_METADATA.map((s) => (
                <div
                  key={s.stepNumber}
                  className={`revised-flow-item ${
                    s.stepNumber === currentStep ? 'revised-flow-item--active' : ''
                  }`}
                  onClick={() => setCurrentStep(s.stepNumber)}
                >
                  <span className="revised-flow-num">{s.stepNumber}</span>
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

export default RevisedItr
