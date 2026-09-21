import { useState, type FormEvent } from 'react'
import './GSTStepAddressBank.css'

export interface AddressBankFormData {
  address: string
  city: string
  pinCode: string
  state: string
  possessionNature: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  accountType: string
  additionalPlaces: string[]
}

interface GSTStepAddressBankProps {
  data: AddressBankFormData
  onChange: (field: keyof AddressBankFormData, value: string | string[]) => void
  onNext: () => void
  onBack: () => void
}

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Delhi',
  'Gujarat',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Haryana',
]

const POSSESSION_TYPES = [
  'Rented',
  'Owned',
  'Leased',
  'Consent',
  'Shared',
]

const ACCOUNT_TYPES = [
  'Current',
  'Savings',
  'Cash Credit',
  'Overdraft',
]

export const GSTStepAddressBank = ({
  data,
  onChange,
  onNext,
  onBack,
}: GSTStepAddressBankProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearErr = (k: string) =>
    setErrors((prev) => {
      if (!prev[k]) return prev
      const { [k]: _, ...rest } = prev
      return rest
    })

  const handleCityChange = (val: string) => {
    // Only text (letters and spaces)
    const cleaned = val.replace(/[^a-zA-Z\s]/g, '')
    onChange('city', cleaned)
    clearErr('city')
  }

  const handlePinCodeChange = (val: string) => {
    // Only numbers, max 6 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 6)
    onChange('pinCode', cleaned)
    clearErr('pinCode')
  }

  const handleAccountHolderChange = (val: string) => {
    // Only text (letters and spaces)
    const cleaned = val.replace(/[^a-zA-Z\s]/g, '')
    onChange('accountHolderName', cleaned)
    clearErr('accountHolderName')
  }

  const handleAccountNumberChange = (val: string) => {
    // Only numbers
    const cleaned = val.replace(/\D/g, '').slice(0, 18)
    onChange('accountNumber', cleaned)
    clearErr('accountNumber')
  }

  const handleIfscChange = (val: string) => {
    // Letters auto-caps, alphanumeric, max 11
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)
    onChange('ifscCode', cleaned)
    clearErr('ifscCode')
  }

  const validate = () => {
    const errs: Record<string, string> = {}

    if (!data.address.trim()) {
      errs.address = 'Address is required'
    }

    if (!data.city.trim()) {
      errs.city = 'City is required (letters only)'
    }

    const pinClean = data.pinCode.replace(/\D/g, '')
    if (!pinClean) {
      errs.pinCode = 'PIN code is required'
    } else if (pinClean.length !== 6) {
      errs.pinCode = `PIN code must be exactly 6 digits (currently ${pinClean.length}/6)`
    }

    if (!data.accountHolderName.trim()) {
      errs.accountHolderName = 'Account holder name is required (letters only)'
    }

    const accClean = data.accountNumber.replace(/\D/g, '')
    if (!accClean) {
      errs.accountNumber = 'Account number is required'
    } else if (accClean.length < 9) {
      errs.accountNumber = 'Account number must be at least 9 digits'
    }

    const ifscClean = data.ifscCode.trim().toUpperCase()
    if (!ifscClean) {
      errs.ifscCode = 'IFSC code is required'
    } else if (ifscClean.length !== 11) {
      errs.ifscCode = `IFSC code must be 11 characters (currently ${ifscClean.length}/11)`
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onNext()
  }

  const handleAddPlace = () => {
    onChange('additionalPlaces', [
      ...data.additionalPlaces,
      `Additional Branch / Warehouse ${data.additionalPlaces.length + 1}`,
    ])
  }

  const handleRemovePlace = (indexToRemove: number) => {
    onChange(
      'additionalPlaces',
      data.additionalPlaces.filter((_, idx) => idx !== indexToRemove)
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="gst-step-address-bank">
      {/* 1. Principal place of business */}
      <section className="gst-step-section-card">
        <div className="gst-step-section-card__header">
          <h2 className="gst-step-section-card__title">Principal place of business</h2>
          <p className="gst-step-section-card__subtitle">
            The address the certificate will carry.
          </p>
        </div>

        <div className="gst-step-section-card__body">
          <div className="gst-form-group gst-form-group--full">
            <label className="gst-form-label" htmlFor="address">
              Address <span className="gst-form-required">*</span>
            </label>
            <textarea
              id="address"
              className={`gst-form-textarea ${errors.address ? 'gst-form-input--error' : ''}`}
              rows={3}
              value={data.address}
              onChange={(e) => {
                onChange('address', e.target.value)
                clearErr('address')
              }}
              placeholder="Shop 14, Laxmi Complex, FC Road, Shivajinagar"
            />
            {errors.address && <p className="gst-form-error-text">⚠️ {errors.address}</p>}
          </div>

          <div className="gst-form-row">
            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="city">
                City (text only) <span className="gst-form-required">*</span>
              </label>
              <input
                id="city"
                type="text"
                className={`gst-form-input ${errors.city ? 'gst-form-input--error' : ''}`}
                value={data.city}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="Pune"
              />
              {errors.city && <p className="gst-form-error-text">⚠️ {errors.city}</p>}
            </div>

            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="pinCode">
                PIN code (numbers only) <span className="gst-form-required">*</span>
              </label>
              <input
                id="pinCode"
                type="text"
                inputMode="numeric"
                className={`gst-form-input ${errors.pinCode ? 'gst-form-input--error' : ''}`}
                value={data.pinCode}
                onChange={(e) => handlePinCodeChange(e.target.value)}
                placeholder="411004"
                maxLength={6}
              />
              {errors.pinCode && <p className="gst-form-error-text">⚠️ {errors.pinCode}</p>}
            </div>
          </div>

          <div className="gst-form-row">
            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="state">
                State <span className="gst-form-required">*</span>
              </label>
              <div className="gst-form-select-wrapper">
                <select
                  id="state"
                  className="gst-form-select"
                  value={data.state}
                  onChange={(e) => onChange('state', e.target.value)}
                  required
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="possessionNature">
                Nature of possession
              </label>
              <div className="gst-form-select-wrapper">
                <select
                  id="possessionNature"
                  className="gst-form-select"
                  value={data.possessionNature}
                  onChange={(e) => onChange('possessionNature', e.target.value)}
                >
                  {POSSESSION_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bank account */}
      <section className="gst-step-section-card">
        <div className="gst-step-section-card__header">
          <h2 className="gst-step-section-card__title">Bank account</h2>
          <p className="gst-step-section-card__subtitle">
            Used for refunds and department correspondence.
          </p>
        </div>

        <div className="gst-step-section-card__body">
          <div className="gst-form-row">
            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="accountHolderName">
                Account holder name (text only) <span className="gst-form-required">*</span>
              </label>
              <input
                id="accountHolderName"
                type="text"
                className={`gst-form-input ${errors.accountHolderName ? 'gst-form-input--error' : ''}`}
                value={data.accountHolderName}
                onChange={(e) => handleAccountHolderChange(e.target.value)}
                placeholder="Shree Deshmukh Traders"
              />
              {errors.accountHolderName && <p className="gst-form-error-text">⚠️ {errors.accountHolderName}</p>}
            </div>

            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="accountNumber">
                Account number (numbers only) <span className="gst-form-required">*</span>
              </label>
              <input
                id="accountNumber"
                type="text"
                inputMode="numeric"
                className={`gst-form-input ${errors.accountNumber ? 'gst-form-input--error' : ''}`}
                value={data.accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                placeholder="As on cheque or statement"
              />
              {errors.accountNumber && <p className="gst-form-error-text">⚠️ {errors.accountNumber}</p>}
            </div>
          </div>

          <div className="gst-form-row">
            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="ifscCode">
                IFSC code <span className="gst-form-required">*</span>
              </label>
              <input
                id="ifscCode"
                type="text"
                className={`gst-form-input ${errors.ifscCode ? 'gst-form-input--error' : ''}`}
                value={data.ifscCode}
                onChange={(e) => handleIfscChange(e.target.value)}
                placeholder="HDFC0000412"
                maxLength={11}
              />
              {errors.ifscCode && <p className="gst-form-error-text">⚠️ {errors.ifscCode}</p>}
            </div>

            <div className="gst-form-group">
              <label className="gst-form-label" htmlFor="accountType">
                Account type
              </label>
              <div className="gst-form-select-wrapper">
                <select
                  id="accountType"
                  className="gst-form-select"
                  value={data.accountType}
                  onChange={(e) => onChange('accountType', e.target.value)}
                >
                  {ACCOUNT_TYPES.map((at) => (
                    <option key={at} value={at}>
                      {at}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Additional place of business */}
      <section className="gst-step-section-card">
        <div className="gst-step-section-card__header">
          <h2 className="gst-step-section-card__title">Additional place of business</h2>
          <p className="gst-step-section-card__subtitle">Godowns and branches, if any.</p>
        </div>

        <div className="gst-step-section-card__body">
          {data.additionalPlaces.map((place, idx) => (
            <div key={place} className="gst-additional-place-item">
              <span className="gst-additional-place-name">{place}</span>
              <button
                type="button"
                className="gst-btn-remove-place"
                onClick={() => handleRemovePlace(idx)}
                aria-label={`Remove ${place}`}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="gst-btn-add-place"
            onClick={handleAddPlace}
          >
            <span className="gst-btn-add-place__icon">+</span>
            Add another place
          </button>
        </div>
      </section>

      {/* Bottom Actions */}
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
          type="submit"
          className="gst-btn-continue"
        >
          Continue
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
    </form>
  )
}
