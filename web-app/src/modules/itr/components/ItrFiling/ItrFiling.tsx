import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import {
  validateItrUploadFile,
  type ItrUploadedFile,
} from '../../validation/itrUploadValidation'
import {
  INCOME_TYPE_OPTIONS,
  STEPS_METADATA,
  type IncomeTypeOption,
} from './ItrFiling'
import {
  ItrStep1View,
  ItrStep2View,
  ItrStep3View,
  ItrStep4View,
} from './ItrFilingSteps'
import {
  ItrStep5View,
  ItrStep6View,
  ItrStep7View,
} from './ItrFilingConfirmSteps'
import './ItrFiling.css'

export const ItrFiling = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedIncomeId, setSelectedIncomeId] = useState('salaried')

  // Form states
  const [panNumber, setPanNumber] = useState('AXTPD4419K')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [salaryDetails, setSalaryDetails] = useState('14,50,000')
  const [deduction80C, setDeduction80C] = useState('1,50,000')
  const [deduction80D, setDeduction80D] = useState('28,000')
  const [homeLoanInterest, setHomeLoanInterest] = useState('1,42,000')
  const [eduLoanInterest, setEduLoanInterest] = useState('')
  const [otherDeductions, setOtherDeductions] = useState('')
  const [previousItrChoice, setPreviousItrChoice] = useState<'previous_itr' | 'tax_notice' | 'none'>('previous_itr')
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    form16: false,
    bank_statements: false,
    ais: false,
    tis: false,
  })
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, ItrUploadedFile>>({})
  const [uploadError, setUploadError] = useState('')

  const activeIncome: IncomeTypeOption =
    INCOME_TYPE_OPTIONS.filter((item) => item.id === selectedIncomeId)[0] ||
    INCOME_TYPE_OPTIONS[0]

  const activeMeta =
    STEPS_METADATA.filter((s) => s.stepNumber === currentStep)[0] ||
    STEPS_METADATA[0]

  const handleFileSelect = (docId: string, file: File) => {
    const res = validateItrUploadFile(file, 10)
    if (!res.isValid || !res.fileInfo) {
      setUploadError(res.error || 'Invalid file')
      pushToast(res.error || 'Invalid file', 'error')
      return
    }

    setUploadedFiles((prev) => ({ ...prev, [docId]: res.fileInfo! }))
    setUploadedDocs((prev) => ({ ...prev, [docId]: true }))
    setUploadError('')
    pushToast(`"${file.name}" uploaded successfully!`, 'success')
  }

  const handleRemoveDoc = (docId: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev }
      delete next[docId]
      return next
    })
    setUploadedDocs((prev) => ({ ...prev, [docId]: false }))
    pushToast('Document removed', 'info')
  }

  const handleNextStep = () => {
    // Screen 4 validation: Require at least one uploaded document in the checklist
    if (currentStep === 4) {
      const uploadedCount = Object.values(uploadedDocs).filter(Boolean).length
      if (uploadedCount === 0) {
        const msg = 'Please upload at least one required document (Form 16, AIS, or Bank statements) to continue.'
        setUploadError(msg)
        pushToast('At least 1 document upload is required', 'error')
        return
      }
      setUploadError('')
    }

    if (currentStep < 7) {
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
    <div className="itr-filing-flow-page">
      {/* 1. Top Meta & Stepper */}
      <div className="itr-filing-topbar">
        <div className="itr-filing-top-meta">
          <span className="itr-filing-section-tag">SECTION 2 · ITR FILING</span>
          <span className="itr-filing-doc-badge">Documented in original requirements</span>
        </div>

        <div className="itr-filing-title-row">
          <h1 className="itr-filing-screen-title">Screen {currentStep} of 7</h1>
          <div className="itr-filing-stepper">
            {STEPS_METADATA.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                className={`itr-filing-step-pill ${
                  s.stepNumber === currentStep
                    ? 'itr-filing-step-pill--active'
                    : s.stepNumber < currentStep
                      ? 'itr-filing-step-pill--completed'
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
      <div className="itr-filing-layout">
        {/* Left Column: Screen Content */}
        <div className="itr-filing-main-card">
          <span className="itr-card-header-label">WHAT THE CUSTOMER SEES</span>

          {currentStep === 1 && (
            <ItrStep1View
              selectedIncomeId={selectedIncomeId}
              onSelectIncome={setSelectedIncomeId}
              activeIncome={activeIncome}
            />
          )}

          {currentStep === 2 && (
            <ItrStep2View
              activeIncome={activeIncome}
              panNumber={panNumber}
              setPanNumber={setPanNumber}
              aadhaarNumber={aadhaarNumber}
              setAadhaarNumber={setAadhaarNumber}
              salaryDetails={salaryDetails}
              setSalaryDetails={setSalaryDetails}
              uploadedDocs={uploadedDocs}
              uploadedFiles={uploadedFiles}
              onFileSelect={handleFileSelect}
              onRemoveDoc={handleRemoveDoc}
            />
          )}

          {currentStep === 3 && (
            <ItrStep3View
              deduction80C={deduction80C}
              setDeduction80C={setDeduction80C}
              deduction80D={deduction80D}
              setDeduction80D={setDeduction80D}
              homeLoanInterest={homeLoanInterest}
              setHomeLoanInterest={setHomeLoanInterest}
              eduLoanInterest={eduLoanInterest}
              setEduLoanInterest={setEduLoanInterest}
              otherDeductions={otherDeductions}
              setOtherDeductions={setOtherDeductions}
              previousItrChoice={previousItrChoice}
              setPreviousItrChoice={setPreviousItrChoice}
            />
          )}

          {currentStep === 4 && (
            <ItrStep4View
              activeIncome={activeIncome}
              uploadedDocs={uploadedDocs}
              uploadedFiles={uploadedFiles}
              onFileSelect={handleFileSelect}
              onRemoveDoc={handleRemoveDoc}
              uploadError={uploadError}
            />
          )}

          {currentStep === 5 && <ItrStep5View activeIncome={activeIncome} />}

          {currentStep === 6 && (
            <ItrStep6View
              onApproveAndFile={() => setCurrentStep(7)}
              onRequestChange={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 7 && (
            <ItrStep7View
              onEverifyAadhaar={() => alert('Aadhaar OTP sent to your registered mobile!')}
              onEverifyNetBanking={() => alert('Redirecting to your bank net banking portal...')}
            />
          )}

          {/* Bottom Action Bar */}
          <div className="itr-filing-bottom-bar">
            <button type="button" className="itr-bottom-back-btn" onClick={handlePrevStep}>
              ← Back
            </button>

            <button type="button" className="itr-bottom-next-btn" onClick={handleNextStep}>
              {currentStep < 7 ? 'Next →' : 'Finish flow ✓'}
            </button>
          </div>
        </div>

        {/* Right Column: Side Explanatory Panel */}
        <aside className="itr-filing-side-panel">
          <div className="itr-side-card">
            <div className="itr-side-card-tag">WHAT THE CUSTOMER SEES</div>
            <p className="itr-side-card-text">{activeMeta.customerSees}</p>
          </div>

          <div className="itr-side-card">
            <div className="itr-side-card-tag">WHAT HAPPENS NEXT</div>
            <p className="itr-side-card-text">{activeMeta.happensNext}</p>
          </div>

          <div className="itr-side-card">
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Flow</div>
            <div className="itr-flow-list">
              {STEPS_METADATA.map((s) => (
                <div
                  key={s.stepNumber}
                  className={`itr-flow-item ${
                    s.stepNumber === currentStep ? 'itr-flow-item--active' : ''
                  }`}
                  onClick={() => setCurrentStep(s.stepNumber)}
                >
                  <span className="itr-flow-num">{s.stepNumber}</span>
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

export default ItrFiling
