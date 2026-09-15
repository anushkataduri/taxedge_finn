import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import './GSTStepDocuments.css'

export interface UploadedDoc {
  id: string
  name: string
  sizeText: string
  dateText: string
  status: 'verified' | 'uploading' | 'rejected'
  progress: number
  errorText?: string
}

const INITIAL_DOCS: UploadedDoc[] = [
  {
    id: 'doc-pan',
    name: 'PAN_AXTPD4419K.pdf',
    sizeText: '240 KB',
    dateText: 'uploaded 29 Aug 2026, 11:04 AM',
    status: 'verified',
    progress: 100,
  },
  {
    id: 'doc-rent',
    name: 'Rent_Agreement_2026.pdf',
    sizeText: '1.8 MB',
    dateText: 'uploading... 64%',
    status: 'uploading',
    progress: 64,
  },
  {
    id: 'doc-address',
    name: 'Address_Proof.jpg',
    sizeText: '1.2 MB',
    dateText: 'Rejected',
    status: 'rejected',
    progress: 100,
    errorText: 'Rejected — document was illegible. Rescan at 300 dpi or higher.',
  },
]

interface GSTStepDocumentsProps {
  onBack: () => void
  onNext: () => void
}

export const GSTStepDocuments = ({ onBack, onNext }: GSTStepDocumentsProps) => {
  const [docs, setDocs] = useState<UploadedDoc[]>(INITIAL_DOCS)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const newDocs: UploadedDoc[] = files.map((file, idx) => ({
      id: `doc-${Date.now()}-${idx}`,
      name: file.name,
      sizeText: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      dateText: 'Uploaded just now',
      status: 'verified',
      progress: 100,
    }))

    setDocs((prev) => [...prev, ...newDocs])
  }

  const handleCancelUpload = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
  }

  const handleReplace = (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              name: 'Address_Proof_v2.jpg',
              status: 'verified',
              errorText: undefined,
              dateText: 'Uploaded just now',
            }
          : d
      )
    )
  }

  return (
    <div className="gst-step-documents">
      <div className="gst-step-documents-card">
        <div className="gst-step-documents-card__header">
          <h2 className="gst-step-documents-card__title">Upload documents</h2>
          <p className="gst-step-documents-card__subtitle">
            Drop files here or pick them from your device.
          </p>
        </div>

        {/* Dropzone */}
        <div
          className={`gst-dropzone ${isDragging ? 'gst-dropzone--active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="gst-dropzone__file-input"
            onChange={handleFileInput}
          />

          <div className="gst-dropzone__icon-circle">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gst-dropzone__icon"
            >
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>

          <p className="gst-dropzone__heading">Drag files here</p>
          <p className="gst-dropzone__sub">
            PDF, JPG, PNG, XLSX or DOCX — up to 10 MB each
          </p>

          <button
            type="button"
            className="gst-btn-browse"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            Browse files
          </button>
        </div>

        {/* Uploaded Documents List */}
        <div className="gst-doc-list">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className={`gst-doc-item gst-doc-item--${doc.status}`}
            >
              <div className="gst-doc-item__main">
                <div className={`gst-doc-item__icon-wrapper gst-doc-item__icon-wrapper--${doc.status}`}>
                  {doc.status === 'verified' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {doc.status === 'uploading' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  {doc.status === 'rejected' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="12 2 2 22 22 22 12 2" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                </div>

                <div className="gst-doc-item__info">
                  <div className="gst-doc-item__name-row">
                    <span className="gst-doc-item__filename">{doc.name}</span>
                  </div>

                  {doc.status === 'rejected' ? (
                    <p className="gst-doc-item__error-text">{doc.errorText}</p>
                  ) : (
                    <p className="gst-doc-item__meta">
                      {doc.sizeText} · {doc.dateText}
                    </p>
                  )}
                </div>

                <div className="gst-doc-item__actions">
                  {doc.status === 'verified' && (
                    <span className="gst-doc-badge gst-doc-badge--verified">
                      • Verified
                    </span>
                  )}

                  {doc.status === 'uploading' && (
                    <div className="gst-doc-item__action-group">
                      <span className="gst-doc-badge gst-doc-badge--uploading">
                        • Uploading
                      </span>
                      <button
                        type="button"
                        className="gst-btn-doc-action"
                        onClick={() => handleCancelUpload(doc.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {doc.status === 'rejected' && (
                    <div className="gst-doc-item__action-group">
                      <span className="gst-doc-badge gst-doc-badge--rejected">
                        • Rejected
                      </span>
                      <button
                        type="button"
                        className="gst-btn-doc-action"
                        onClick={() => handleReplace(doc.id)}
                      >
                        Replace
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Line */}
              {doc.status !== 'rejected' && (
                <div className="gst-doc-item__progress-bar">
                  <div
                    className={`gst-doc-item__progress-fill gst-doc-item__progress-fill--${doc.status}`}
                    style={{ width: `${doc.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="gst-step-actions">
          <button
            type="button"
            className="gst-btn-back"
            onClick={onBack}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gst-btn-back-arrow"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to checklist
          </button>

          <button
            type="button"
            className="gst-btn-continue"
            onClick={onNext}
          >
            Continue to review
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gst-btn-arrow"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
