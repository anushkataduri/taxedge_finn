import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import {
  GST_AMENDMENT_CUSTOMER_RECORD,
  GST_AMENDMENT_FIELD_OPTIONS,
  type AmendmentFieldOption,
} from '../../../data/gstAmendmentData'
import type { GstAmendmentPayload } from '../../../types/gst.types'
import './GSTAmendmentForm.css'

interface GSTAmendmentFormProps {
  isSubmitting?: boolean
  onSubmit: (payload: GstAmendmentPayload) => void
  onAllFormsClick?: () => void
}

export const GSTAmendmentForm = ({
  isSubmitting = false,
  onSubmit,
  onAllFormsClick,
}: GSTAmendmentFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>(GST_AMENDMENT_FIELD_OPTIONS[0].key)
  const [newValue, setNewValue] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ newValue?: string; document?: string }>({})

  const activeOption: AmendmentFieldOption =
    GST_AMENDMENT_FIELD_OPTIONS.find((opt) => opt.key === selectedFieldKey) ||
    GST_AMENDMENT_FIELD_OPTIONS[0]

  const handleFieldSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFieldKey(e.target.value)
    setNewValue('')
    setErrors({})
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, document: 'File size must be under 10 MB.' }))
        return
      }
      setSelectedFile(file)
      setErrors((prev) => ({ ...prev, document: undefined }))
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors: { newValue?: string; document?: string } = {}
    if (!newValue.trim()) newErrors.newValue = 'Please enter the updated new value.'
    if (!selectedFile) newErrors.document = 'Please upload a supporting document.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit({
      gstin: GST_AMENDMENT_CUSTOMER_RECORD.gstin,
      fieldBeingChanged: activeOption.label,
      fieldKey: activeOption.key,
      oldValue: activeOption.oldValue,
      newValue: newValue.trim(),
      supportingDocumentName: selectedFile?.name,
      supportingDocumentFile: selectedFile,
    })
  }

  return (
    <div className="gst-amend-live-card">
      <div className="gst-amend-live-card__header">
        <div className="gst-amend-live-card__titles">
          <h2 className="gst-amend-live-card__title">What the customer sees</h2>
          <p className="gst-amend-live-card__subtitle">Live screen — numbered to match the field spec.</p>
        </div>
        <span className="gst-amend-live-card__badge">5 of 5 shown</span>
      </div>

      <form onSubmit={handleSubmit} className="gst-amend-form" noValidate>
        {/* Field 1: GSTIN */}
        <div className="gst-amend-form__group">
          <div className="gst-amend-form__label-row">
            <span className="gst-amend-form__number-badge">1</span>
            <label className="gst-amend-form__label">GSTIN</label>
            <span className="gst-amend-form__autofill-badge">✓ Auto-filled</span>
          </div>
          <div className="gst-amend-form__autofill-box">{GST_AMENDMENT_CUSTOMER_RECORD.gstin}</div>
          <span className="gst-amend-form__hint">Auto-filled from the customer&apos;s GST Registration</span>
        </div>

        {/* Field 2: Field Being Changed */}
        <div className="gst-amend-form__group">
          <div className="gst-amend-form__label-row">
            <span className="gst-amend-form__number-badge">2</span>
            <label htmlFor="field-being-changed" className="gst-amend-form__label">
              Field Being Changed <span className="gst-amend-form__required-star">*</span>
            </label>
          </div>
          <div className="gst-amend-form__select-wrapper">
            <select
              id="field-being-changed"
              className="gst-amend-form__select"
              value={selectedFieldKey}
              onChange={handleFieldSelectChange}
            >
              {GST_AMENDMENT_FIELD_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="gst-amend-form__select-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
          <span className="gst-amend-form__hint">
            Business name, address, business type, bank details, authorized signatory, additional place of business
          </span>
        </div>

        {/* Field 3: Old Value */}
        <div className="gst-amend-form__group">
          <div className="gst-amend-form__label-row">
            <span className="gst-amend-form__number-badge">3</span>
            <label className="gst-amend-form__label">Old Value</label>
            <span className="gst-amend-form__autofill-badge">✓ Auto-filled</span>
          </div>
          <div className="gst-amend-form__autofill-box gst-amend-form__autofill-box--multiline">
            {activeOption.oldValue}
          </div>
          <span className="gst-amend-form__hint">
            Auto-filled where the system already has the current value
          </span>
        </div>

        {/* Field 4: New Value */}
        <div className="gst-amend-form__group">
          <div className="gst-amend-form__label-row">
            <span className="gst-amend-form__number-badge">4</span>
            <label htmlFor="new-amended-value" className="gst-amend-form__label">
              New Value <span className="gst-amend-form__required-star">*</span>
            </label>
          </div>
          <textarea
            id="new-amended-value"
            className={`gst-amend-form__input ${errors.newValue ? 'has-error' : ''}`}
            rows={2}
            placeholder={activeOption.placeholder}
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value)
              if (errors.newValue) setErrors((prev) => ({ ...prev, newValue: undefined }))
            }}
          />
          {errors.newValue ? (
            <span className="gst-amend-form__error-text">{errors.newValue}</span>
          ) : (
            <span className="gst-amend-form__hint">Required</span>
          )}
        </div>

        {/* Field 5: Supporting Document */}
        <div className="gst-amend-form__group">
          <div className="gst-amend-form__label-row">
            <span className="gst-amend-form__number-badge">5</span>
            <label className="gst-amend-form__label">
              Supporting Document <span className="gst-amend-form__required-star">*</span>
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="gst-amend-form__file-hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          <div
            className={`gst-amend-form__upload-box ${errors.document ? 'has-error' : ''}`}
            onClick={handleBrowseClick}
            role="button"
            tabIndex={0}
          >
            <div className="gst-amend-form__upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="gst-amend-form__upload-meta">
              {selectedFile ? (
                <div className="gst-amend-form__selected-file">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <span className="gst-amend-form__upload-title">Choose a file to upload</span>
                  <span className="gst-amend-form__upload-sub">PDF, JPG or PNG · up to 10 MB</span>
                </>
              )}
            </div>

            {selectedFile ? (
              <button
                type="button"
                className="gst-amend-form__remove-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                className="gst-amend-form__browse-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBrowseClick()
                }}
              >
                Browse
              </button>
            )}
          </div>

          {errors.document ? (
            <span className="gst-amend-form__error-text">{errors.document}</span>
          ) : (
            <span className="gst-amend-form__hint">
              Proof of the change — e.g. new rental agreement, name-change certificate
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="gst-amend-form__actions">
          <Link
            to={routePaths.gst.root}
            onClick={onAllFormsClick}
            className="gst-amend-form__btn-all-forms"
          >
            ← All forms
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="gst-amend-form__btn-submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit GST Amendment →'}
          </button>
        </div>
      </form>
    </div>
  )
}
