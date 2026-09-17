import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { routePaths } from '@core/config'
import {
  GST_CERTIFICATE_CUSTOMER_RECORD,
  GST_CERTIFICATE_REQUEST_TYPES,
  GST_CERTIFICATE_META,
} from '../../../data/gstCertificateData'
import type { GstCertificatePayload } from '../../../types/gst.types'
import './GSTCertificateForm.css'

interface GSTCertificateFormProps {
  isSubmitting?: boolean
  onSubmit: (payload: GstCertificatePayload) => void
  onAllFormsClick?: () => void
}

export const GSTCertificateForm = ({
  isSubmitting = false,
  onSubmit,
  onAllFormsClick,
}: GSTCertificateFormProps) => {
  const [selectedRequestType, setSelectedRequestType] = useState<string>(
    GST_CERTIFICATE_REQUEST_TYPES[0].label
  )

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRequestType(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      gstin: GST_CERTIFICATE_CUSTOMER_RECORD.gstin,
      registeredContact: GST_CERTIFICATE_CUSTOMER_RECORD.registeredContact,
      requestType: selectedRequestType,
    })
  }

  return (
    <div className="gst-cert-live-card">
      <div className="gst-cert-live-card__header">
        <div className="gst-cert-live-card__titles">
          <h2 className="gst-cert-live-card__title">What the customer sees</h2>
          <p className="gst-cert-live-card__subtitle">Live screen — numbered to match the field spec.</p>
        </div>
        <span className="gst-cert-live-card__badge">3 of 3 shown</span>
      </div>

      <form onSubmit={handleSubmit} className="gst-cert-form" noValidate>
        {/* Field 1: GSTIN */}
        <div className="gst-cert-form__group">
          <div className="gst-cert-form__label-row">
            <span className="gst-cert-form__number-badge">1</span>
            <label className="gst-cert-form__label">GSTIN</label>
            <span className="gst-cert-form__autofill-badge">✓ Auto-filled</span>
          </div>
          <div className="gst-cert-form__autofill-box">{GST_CERTIFICATE_CUSTOMER_RECORD.gstin}</div>
          <span className="gst-cert-form__hint">{GST_CERTIFICATE_META.fieldNotes.gstin}</span>
        </div>

        {/* Field 2: Registered Mobile / Email */}
        <div className="gst-cert-form__group">
          <div className="gst-cert-form__label-row">
            <span className="gst-cert-form__number-badge">2</span>
            <label className="gst-cert-form__label">Registered Mobile / Email</label>
            <span className="gst-cert-form__autofill-badge">✓ Auto-filled</span>
          </div>
          <div className="gst-cert-form__autofill-box">
            {GST_CERTIFICATE_CUSTOMER_RECORD.registeredContact}
          </div>
          <span className="gst-cert-form__hint">
            {GST_CERTIFICATE_META.fieldNotes.registeredContact}
          </span>
        </div>

        {/* Field 3: Request Type */}
        <div className="gst-cert-form__group">
          <div className="gst-cert-form__label-row">
            <span className="gst-cert-form__number-badge">3</span>
            <label htmlFor="certificate-request-type" className="gst-cert-form__label">
              Request Type <span className="gst-cert-form__required-star">*</span>
            </label>
          </div>
          <div className="gst-cert-form__select-wrapper">
            <select
              id="certificate-request-type"
              className="gst-cert-form__select"
              value={selectedRequestType}
              onChange={handleSelectChange}
            >
              {GST_CERTIFICATE_REQUEST_TYPES.map((type) => (
                <option key={type.key} value={type.label}>
                  {type.label}
                </option>
              ))}
            </select>
            <span className="gst-cert-form__select-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
          <span className="gst-cert-form__hint">{GST_CERTIFICATE_META.fieldNotes.requestType}</span>
        </div>

        {/* Action Buttons */}
        <div className="gst-cert-form__actions">
          <Link
            to={routePaths.gst.root}
            onClick={onAllFormsClick}
            className="gst-cert-form__btn-all-forms"
          >
            ← All forms
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="gst-cert-form__btn-submit"
          >
            {isSubmitting ? 'Processing...' : 'Submit GST Certificate →'}
          </button>
        </div>
      </form>
    </div>
  )
}
