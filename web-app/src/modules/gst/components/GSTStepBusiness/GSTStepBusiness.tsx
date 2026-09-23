import { useState, type FormEvent } from 'react'
import './GSTStepBusiness.css'

export interface BusinessFormData {
  legalName: string
  tradeName: string
  pan: string
  aadhaar: string
  mobile: string
  email: string
  constitution: string
  natureOfBusiness: string
  principalActivity: string
  turnover: string
  compositionScheme: string
}

interface GSTStepBusinessProps {
  data: BusinessFormData
  onChange: (field: keyof BusinessFormData, value: string) => void
  onNext: () => void
  onCancel: () => void
}

export const GSTStepBusiness = ({
  data,
  onChange,
  onNext,
  onCancel,
}: GSTStepBusinessProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearErr = (k: string) =>
    setErrors((prev) => {
      if (!prev[k]) return prev
      const { [k]: _, ...rest } = prev
      return rest
    })

  const handleLegalNameChange = (val: string) => {
    // Only text (letters and spaces), no numbers
    const cleaned = val.replace(/[^a-zA-Z\s]/g, '')
    onChange('legalName', cleaned)
    clearErr('legalName')
  }

  const handleTradeNameChange = (val: string) => {
    // Only text (letters and spaces), no numbers
    const cleaned = val.replace(/[^a-zA-Z\s]/g, '')
    onChange('tradeName', cleaned)
    clearErr('tradeName')
  }

  const handlePanChange = (val: string) => {
    // Letters automatically uppercase, max 10 alphanumeric
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    onChange('pan', cleaned)
    clearErr('pan')
  }

  const handleAadhaarChange = (val: string) => {
    // Numbers only, max 12 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 12)
    onChange('aadhaar', cleaned)
    clearErr('aadhaar')
  }

  const handleMobileChange = (val: string) => {
    // Numbers only, max 10 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 10)
    onChange('mobile', cleaned)
    clearErr('mobile')
  }

  const handleEmailChange = (val: string) => {
    onChange('email', val)
    clearErr('email')
  }

  const validate = () => {
    const errs: Record<string, string> = {}

    if (!data.legalName.trim()) {
      errs.legalName = 'Legal name is required (letters only)'
    } else if (data.legalName.trim().length < 3) {
      errs.legalName = 'Legal name must be at least 3 characters'
    }

    const panClean = data.pan.trim().toUpperCase()
    if (!panClean) {
      errs.pan = 'PAN is required'
    } else if (panClean.length !== 10) {
      errs.pan = `PAN must be exactly 10 characters (currently ${panClean.length}/10)`
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panClean)) {
      errs.pan = 'Invalid PAN format (e.g. AXTPD4419K)'
    }

    const aadhaarClean = data.aadhaar.replace(/\D/g, '')
    if (!aadhaarClean) {
      errs.aadhaar = 'Aadhaar is required'
    } else if (aadhaarClean.length !== 12) {
      errs.aadhaar = `Aadhaar must be exactly 12 digits (currently ${aadhaarClean.length}/12)`
    }

    const mobileClean = data.mobile.replace(/\D/g, '')
    if (!mobileClean) {
      errs.mobile = 'Mobile number is required'
    } else if (mobileClean.length !== 10) {
      errs.mobile = `Mobile number must be exactly 10 digits (currently ${mobileClean.length}/10)`
    } else if (!/^[6-9]\d{9}$/.test(mobileClean)) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number'
    }

    if (!data.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Enter a valid email address'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onNext()
  }

  return (
    <div className="gst-step-business-card">
      <div className="gst-step-business-card__header">
        <h2 className="gst-step-business-card__title">Business details</h2>
        <p className="gst-step-business-card__subtitle">
          As they should appear on the GST certificate.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="gst-step-business-form">
        {/* Row 1: Legal Name & Trade Name */}
        <div className="gst-form-row">
          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="legalName">
              Legal name of business <span className="gst-form-required">*</span>
            </label>
            <input
              id="legalName"
              type="text"
              className={`gst-form-input ${errors.legalName ? 'gst-form-input--error' : ''}`}
              value={data.legalName}
              onChange={(e) => handleLegalNameChange(e.target.value)}
              placeholder="e.g. Shree Deshmukh Traders (text only)"
            />
            {errors.legalName && <p className="gst-form-error-text">⚠️ {errors.legalName}</p>}
          </div>

          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="tradeName">
              Trade name (text only)
            </label>
            <input
              id="tradeName"
              type="text"
              className="gst-form-input"
              value={data.tradeName}
              onChange={(e) => handleTradeNameChange(e.target.value)}
              placeholder="e.g. Deshmukh Traders"
            />
          </div>
        </div>

        {/* Row 2: PAN & Aadhaar */}
        <div className="gst-form-row">
          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="pan">
              PAN of business <span className="gst-form-required">*</span>
            </label>
            <input
              id="pan"
              type="text"
              className={`gst-form-input ${errors.pan ? 'gst-form-input--error' : ''}`}
              value={data.pan}
              onChange={(e) => handlePanChange(e.target.value)}
              placeholder="e.g. AXTPD4419K"
              maxLength={10}
            />
            {errors.pan && <p className="gst-form-error-text">⚠️ {errors.pan}</p>}
          </div>

          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="aadhaar">
              Aadhaar of proprietor <span className="gst-form-required">*</span>
            </label>
            <input
              id="aadhaar"
              type="text"
              inputMode="numeric"
              className={`gst-form-input ${errors.aadhaar ? 'gst-form-input--error' : ''}`}
              value={data.aadhaar}
              onChange={(e) => handleAadhaarChange(e.target.value)}
              placeholder="12-digit Aadhaar (numbers only)"
              maxLength={12}
            />
            {errors.aadhaar && <p className="gst-form-error-text">⚠️ {errors.aadhaar}</p>}
          </div>
        </div>

        {/* Row 3: Mobile & Email */}
        <div className="gst-form-row">
          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="mobile">
              Mobile <span className="gst-form-required">*</span>
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              className={`gst-form-input ${errors.mobile ? 'gst-form-input--error' : ''}`}
              value={data.mobile}
              onChange={(e) => handleMobileChange(e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {errors.mobile && <p className="gst-form-error-text">⚠️ {errors.mobile}</p>}
          </div>

          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="email">
              Email <span className="gst-form-required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`gst-form-input ${errors.email ? 'gst-form-input--error' : ''}`}
              value={data.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="anjali@shreedeshmukh.in"
            />
            {errors.email && <p className="gst-form-error-text">⚠️ {errors.email}</p>}
          </div>
        </div>

        {/* Row 4: Constitution & Nature of business */}
        <div className="gst-form-row">
          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="constitution">
              Constitution of business
            </label>
            <div className="gst-form-select-wrapper">
              <select
                id="constitution"
                className="gst-form-select"
                value={data.constitution}
                onChange={(e) => onChange('constitution', e.target.value)}
              >
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Limited Liability Partnership">LLP</option>
                <option value="Private Limited Company">Private Limited Company</option>
              </select>
            </div>
          </div>

          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="natureOfBusiness">
              Nature of business
            </label>
            <div className="gst-form-select-wrapper">
              <select
                id="natureOfBusiness"
                className="gst-form-select"
                value={data.natureOfBusiness}
                onChange={(e) => onChange('natureOfBusiness', e.target.value)}
              >
                <option value="Trading">Trading</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Services">Services</option>
                <option value="Export/Import">Export / Import</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 5: Principal business activity */}
        <div className="gst-form-group gst-form-group--full">
          <label className="gst-form-label" htmlFor="principalActivity">
            Principal business activity
          </label>
          <textarea
            id="principalActivity"
            className="gst-form-textarea"
            rows={3}
            value={data.principalActivity}
            onChange={(e) => onChange('principalActivity', e.target.value)}
            placeholder="Describe your primary goods or services..."
          />
        </div>

        {/* Row 6: Expected annual turnover & Composition scheme */}
        <div className="gst-form-row">
          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="turnover">
              Expected annual turnover
            </label>
            <div className="gst-form-select-wrapper">
              <select
                id="turnover"
                className="gst-form-select"
                value={data.turnover}
                onChange={(e) => onChange('turnover', e.target.value)}
              >
                <option value="₹40 lakh – ₹1 crore">₹40 lakh – ₹1 crore</option>
                <option value="Below ₹40 lakh">Below ₹40 lakh</option>
                <option value="₹1 crore – ₹5 crore">₹1 crore – ₹5 crore</option>
                <option value="Above ₹5 crore">Above ₹5 crore</option>
              </select>
            </div>
          </div>

          <div className="gst-form-group">
            <label className="gst-form-label" htmlFor="compositionScheme">
              Composition scheme
            </label>
            <div className="gst-form-select-wrapper">
              <select
                id="compositionScheme"
                className="gst-form-select"
                value={data.compositionScheme}
                onChange={(e) => onChange('compositionScheme', e.target.value)}
              >
                <option value="No — regular scheme">No — regular scheme</option>
                <option value="Yes — composition scheme">Yes — composition scheme</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="gst-step-actions">
          <button
            type="button"
            className="gst-btn-cancel"
            onClick={onCancel}
          >
            Cancel
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
    </div>
  )
}
