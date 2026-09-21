import { useState } from 'react'
import type { BusinessFormData } from '../GSTStepBusiness/GSTStepBusiness'
import type { AddressBankFormData } from '../GSTStepAddressBank/GSTStepAddressBank'
import './GSTStepReview.css'

interface GSTStepReviewProps {
  businessData: BusinessFormData
  addressBankData: AddressBankFormData
  onEdit: () => void
  onBack: () => void
  onProceed: () => void
}

const ATTACHED_DOCS = [
  'PAN of business / proprietor',
  'Aadhaar of proprietor',
  'Photograph of proprietor',
  'Rental agreement',
]

export const GSTStepReview = ({
  businessData,
  addressBankData,
  onEdit,
  onBack,
  onProceed,
}: GSTStepReviewProps) => {
  const [decl1, setDecl1] = useState(true)
  const [decl2, setDecl2] = useState(true)

  const canProceed = decl1 && decl2

  const reviewFields = [
    { label: 'Legal name', value: businessData.legalName || 'Shree Deshmukh Traders' },
    { label: 'Trade name', value: businessData.tradeName || 'Deshmukh Traders' },
    { label: 'PAN', value: businessData.pan || 'AXTPD4419K' },
    { label: 'Constitution', value: businessData.constitution || 'Proprietorship' },
    { label: 'Nature of business', value: businessData.natureOfBusiness || 'Trading' },
    {
      label: 'Principal place',
      value: `${addressBankData.address || 'Shop 14, Laxmi Complex, FC Road'}, ${addressBankData.city || 'Pune'} ${addressBankData.pinCode || '411004'}`,
    },
    { label: 'Possession', value: addressBankData.possessionNature || 'Rented' },
    {
      label: 'Bank',
      value: `${addressBankData.ifscCode || 'HDFC0000412'} · ${addressBankData.accountType || 'Current'}`,
    },
    {
      label: 'Composition scheme',
      value: businessData.compositionScheme || 'No — regular scheme',
    },
  ]

  return (
    <div className="gst-step-review">
      {/* 1. Review Details Card */}
      <section className="gst-review-card">
        <div className="gst-review-card__header">
          <div>
            <h2 className="gst-review-card__title">Review your application</h2>
            <p className="gst-review-card__subtitle">
              Check every field. After submission, changes need an amendment application.
            </p>
          </div>
          <button
            type="button"
            className="gst-btn-edit"
            onClick={onEdit}
            aria-label="Edit application fields"
          >
            Edit
          </button>
        </div>

        <div className="gst-review-grid">
          {reviewFields.map((field) => (
            <div key={field.label} className="gst-review-row">
              <span className="gst-review-label">{field.label}</span>
              <span className="gst-review-value">{field.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Documents Attached Card */}
      <section className="gst-review-card">
        <h3 className="gst-review-card__section-title">Documents attached</h3>
        <ul className="gst-review-docs-list">
          {ATTACHED_DOCS.map((doc) => (
            <li key={doc} className="gst-review-doc-item">
              <span className="gst-review-doc-check">✓</span>
              <span className="gst-review-doc-name">{doc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Declaration Card */}
      <section className="gst-review-card">
        <h3 className="gst-review-card__section-title">Declaration</h3>
        <div className="gst-review-declarations">
          <label className="gst-decl-label">
            <input
              type="checkbox"
              className="gst-decl-checkbox"
              checked={decl1}
              onChange={(e) => setDecl1(e.target.checked)}
            />
            <span className="gst-decl-text">
              I declare that the information given above is true and correct to the best of my
              knowledge, and that no fact material to the application has been concealed. I
              authorise TaxEdge Fin Solutions to file this application on my behalf.
            </span>
          </label>

          <label className="gst-decl-label">
            <input
              type="checkbox"
              className="gst-decl-checkbox"
              checked={decl2}
              onChange={(e) => setDecl2(e.target.checked)}
            />
            <span className="gst-decl-text">
              I agree to the professional fee shown and understand it is non-refundable once
              the application is submitted to the department.
            </span>
          </label>
        </div>
      </section>

      {/* Actions */}
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
          Back
        </button>

        <button
          type="button"
          className="gst-btn-continue"
          disabled={!canProceed}
          onClick={onProceed}
        >
          Proceed to payment
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
  )
}
