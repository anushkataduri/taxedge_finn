import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routePaths } from '@core/config'
import { useAppStore } from '@store/index'
import {
  NOTICE_STEPS_METADATA,
  NOTICE_CHECKLIST_DOCS,
  type NoticeStepMeta,
  type UploadedFileInfo,
} from './TaxNoticeAssistance'
import {
  NoticeStep1View,
  NoticeStep2View,
  NoticeStep3View,
  NoticeStep4View,
  NoticeStep5View,
} from './TaxNoticeAssistanceSteps'
import './TaxNoticeAssistance.css'

export const TaxNoticeAssistance = () => {
  const navigate = useNavigate()
  const pushToast = useAppStore((state) => state.pushToast)
  const [currentStep, setCurrentStep] = useState(1)

  // Screen 1 states
  const [noticeDocUploaded, setNoticeDocUploaded] = useState(false)
  const [uploadedNoticeFile, setUploadedNoticeFile] = useState<UploadedFileInfo | null>(null)
  const [noticeNumber, setNoticeNumber] = useState('CPC/2526/A3/284419260')
  const [noticeDate, setNoticeDate] = useState('18-08-2026')
  const [uploadError, setUploadError] = useState('')
  const [noticeNumberError, setNoticeNumberError] = useState('')

  // Screen 3 states
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    bank_interest_cert: false,
    ais_ay2526: false,
    form_26as: false,
    statement_in_question: false,
  })
  const [checklistFiles, setChecklistFiles] = useState<Record<string, UploadedFileInfo>>({})
  const [explanation, setExplanation] = useState('')
  const [checklistError, setChecklistError] = useState('')

  const activeMeta: NoticeStepMeta =
    NOTICE_STEPS_METADATA.filter((s) => s.stepNumber === currentStep)[0] ||
    NOTICE_STEPS_METADATA[0]

  // File validation helper (checks format and 10MB limit)
  const validateFile = (file: File): boolean => {
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png']
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!validExtensions.includes(ext)) {
      const msg = 'Invalid file format. Please upload a Photo or PDF (.pdf, .jpg, .png).'
      setUploadError(msg)
      pushToast(msg, 'error')
      return false
    }

    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      const msg = `File size exceeds 10 MB limit (${sizeMb} MB). Please choose a smaller file.`
      setUploadError(msg)
      pushToast(msg, 'error')
      return false
    }

    return true
  }

  const formatFileSize = (bytes: number): string => {
    return bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`
  }

  // Screen 1 upload handlers
  const handleNoticeFileSelect = (file: File) => {
    if (!validateFile(file)) return
    const fileInfo: UploadedFileInfo = {
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setUploadedNoticeFile(fileInfo)
    setNoticeDocUploaded(true)
    setUploadError('')
    pushToast(`Notice document "${file.name}" uploaded successfully!`, 'success')
  }

  const handleRemoveNoticeFile = () => {
    setUploadedNoticeFile(null)
    setNoticeDocUploaded(false)
    pushToast('Notice document removed', 'info')
  }

  // Screen 3 upload handlers
  const handleChecklistFileSelect = (id: string, file: File) => {
    if (!validateFile(file)) return
    const fileInfo: UploadedFileInfo = {
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setChecklistFiles((prev) => ({ ...prev, [id]: fileInfo }))
    setUploadedDocs((prev) => ({ ...prev, [id]: true }))
    setChecklistError('')
    pushToast(`"${file.name}" uploaded successfully!`, 'success')
  }

  const handleRemoveChecklistDoc = (id: string) => {
    setChecklistFiles((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setUploadedDocs((prev) => ({ ...prev, [id]: false }))
    pushToast('Document removed', 'info')
  }

  const handleNextStep = () => {
    // Screen 1 validation: Must upload notice document and provide Notice Number
    if (currentStep === 1) {
      let hasError = false
      if (!noticeDocUploaded && !uploadedNoticeFile) {
        const errorMsg = 'Please upload the notice document (Photo or PDF up to 10 MB) before proceeding.'
        setUploadError(errorMsg)
        pushToast('Notice document upload is required', 'error')
        hasError = true
      } else {
        setUploadError('')
      }

      if (!noticeNumber.trim()) {
        const numMsg = 'Notice Number is required.'
        setNoticeNumberError(numMsg)
        pushToast(numMsg, 'error')
        hasError = true
      } else {
        setNoticeNumberError('')
      }

      if (hasError) return
    }

    // Screen 3 validation: Must upload at least one document
    if (currentStep === 3) {
      const uploadedCount = NOTICE_CHECKLIST_DOCS.filter((d) => uploadedDocs[d.id]).length
      if (uploadedCount === 0) {
        const chkMsg = 'Please upload at least one supporting document before submitting.'
        setChecklistError(chkMsg)
        pushToast('At least 1 supporting document is required', 'error')
        return
      }
      setChecklistError('')
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
    <div className="notice-flow-page">
      {/* 1. Top Meta & Stepper */}
      <div className="notice-flow-topbar">
        <div className="notice-flow-top-meta">
          <span className="notice-flow-section-tag">SECTION 6 · TAX NOTICE ASSISTANCE</span>
          <span className="notice-flow-doc-badge">Recommended design — confirm with client</span>
        </div>

        <div className="notice-flow-title-row">
          <h1 className="notice-flow-screen-title">Screen {currentStep} of 5</h1>
          <div className="notice-flow-stepper">
            {NOTICE_STEPS_METADATA.map((s) => (
              <button
                key={s.stepNumber}
                type="button"
                className={`notice-flow-step-pill ${
                  s.stepNumber === currentStep
                    ? 'notice-flow-step-pill--active'
                    : s.stepNumber < currentStep
                      ? 'notice-flow-step-pill--completed'
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
          <div className="notice-top-note-box">
            <div className="notice-top-note-header">
              <span className="notice-top-note-icon">⚠️</span>
              <strong className="notice-top-note-title">Note</strong>
            </div>
            <p className="notice-top-note-text">
              Also listed by name only in the requirements. The flow below follows standard
              practice for helping a customer respond to an Income Tax Department notice, and
              should be confirmed with the client before development.
            </p>
          </div>
        )}
      </div>

      {/* 2. Main 2-Column Grid */}
      <div className="notice-flow-layout">
        {/* Left Column: Main Card */}
        <div className="notice-flow-main-card">
          <span className="notice-card-header-label">WHAT THE CUSTOMER SEES</span>

          {currentStep === 1 && (
            <NoticeStep1View
              noticeDocUploaded={noticeDocUploaded}
              uploadedFile={uploadedNoticeFile}
              onFileSelect={handleNoticeFileSelect}
              onRemoveFile={handleRemoveNoticeFile}
              noticeNumber={noticeNumber}
              setNoticeNumber={(val) => {
                setNoticeNumber(val)
                if (val.trim()) setNoticeNumberError('')
              }}
              noticeDate={noticeDate}
              setNoticeDate={setNoticeDate}
              uploadError={uploadError}
              noticeNumberError={noticeNumberError}
            />
          )}

          {currentStep === 2 && <NoticeStep2View />}

          {currentStep === 3 && (
            <NoticeStep3View
              uploadedDocs={uploadedDocs}
              uploadedFiles={checklistFiles}
              onFileSelect={handleChecklistFileSelect}
              onRemoveDoc={handleRemoveChecklistDoc}
              explanation={explanation}
              setExplanation={setExplanation}
              checklistError={checklistError}
            />
          )}

          {currentStep === 4 && (
            <NoticeStep4View
              onRequestChanges={() => setCurrentStep(3)}
              onApproveAndSubmit={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && <NoticeStep5View />}

          {/* Bottom Action Bar */}
          <div className="notice-flow-bottom-bar">
            <button
              type="button"
              className="notice-bottom-back-btn"
              onClick={handlePrevStep}
            >
              ← Back
            </button>

            <button
              type="button"
              className="notice-bottom-next-btn"
              onClick={handleNextStep}
            >
              {currentStep < 5 ? 'Next →' : 'Finish flow ✓'}
            </button>
          </div>
        </div>

        {/* Right Column: Side Explanatory Panel */}
        <aside className="notice-flow-side-panel">
          <div className="notice-side-card">
            <div className="notice-side-card-tag">WHAT THE CUSTOMER SEES</div>
            <p className="notice-side-card-text">{activeMeta.customerSees}</p>
          </div>

          <div className="notice-side-card">
            <div className="notice-side-card-tag">WHAT HAPPENS NEXT</div>
            <p className="notice-side-card-text">{activeMeta.happensNext}</p>
          </div>

          <div className="notice-side-card">
            <div className="notice-side-card-title">Flow</div>
            <div className="notice-flow-list">
              {NOTICE_STEPS_METADATA.map((s) => (
                <div
                  key={s.stepNumber}
                  className={`notice-flow-item ${
                    s.stepNumber === currentStep ? 'notice-flow-item--active' : ''
                  }`}
                  onClick={() => setCurrentStep(s.stepNumber)}
                >
                  <span className="notice-flow-num">{s.stepNumber}</span>
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

export default TaxNoticeAssistance
