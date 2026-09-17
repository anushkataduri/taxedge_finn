import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button, Input } from '@shared/components'
import { profileSchema } from '../../validation/profileSchema'
import type { ProfileFormValues } from '../../validation/profileSchema'
import './ProfileForm.css'

export interface ProfileFormProps {
  initialValues?: Partial<ProfileFormValues>
  onSubmit: (values: ProfileFormValues) => Promise<void> | void
  isLoading?: boolean
}

const DEFAULT_VALUES: ProfileFormValues = {
  fullName: '',
  email: '',
  dob: '',
  pan: '',
  aadhaar: '',
  mobile: '',
  passcode: '',
  confirmPasscode: '',
  address: '',
}

export const ProfileForm = ({
  initialValues,
  onSubmit,
  isLoading = false,
}: ProfileFormProps) => {
  const [values, setValues] = useState<ProfileFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormValues | 'form', string>>>({})
  const dateInputRef = useRef<HTMLInputElement>(null)

  const formatPAN = (val: string) => val.toUpperCase().slice(0, 10)

  const formatAadhaar = (val: string) => val.replace(/\D/g, '').slice(0, 12)

  const formatMobile = (val: string) => val.replace(/\D/g, '').slice(0, 10)

  const formatPasscode = (val: string) => val.replace(/\D/g, '').slice(0, 6)

  const formatDOB = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
  }

  const handleDatePickerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const pickerValue = event.target.value // Format: YYYY-MM-DD
    if (!pickerValue) return

    const parts = pickerValue.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      const formatted = `${day}-${month}-${year}`
      setValues((prev) => ({ ...prev, dob: formatted }))
      if (errors.dob) {
        setErrors((prev) => ({ ...prev, dob: undefined }))
      }
    }
  }

  const openCalendar = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker()
        } catch {
          dateInputRef.current.click()
        }
      } else {
        dateInputRef.current.click()
      }
    }
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD for native picker value
  const getPickerValue = () => {
    const match = values.dob.match(/^(\d{2})-(\d{2})-(\d{4})$/)
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`
    }
    return ''
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    let formattedValue = value

    if (name === 'pan') {
      formattedValue = formatPAN(value)
    } else if (name === 'aadhaar') {
      formattedValue = formatAadhaar(value)
    } else if (name === 'mobile') {
      formattedValue = formatMobile(value)
    } else if (name === 'passcode' || name === 'confirmPasscode') {
      formattedValue = formatPasscode(value)
    } else if (name === 'dob' && !value.includes('/') && value.length > (values.dob?.length || 0)) {
      formattedValue = formatDOB(value)
    }

    setValues((prev) => ({ ...prev, [name]: formattedValue }))

    if (errors[name as keyof ProfileFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: undefined }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = profileSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormValues, string>> = {}
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof ProfileFormValues
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    try {
      await onSubmit(result.data as ProfileFormValues)
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Unable to save profile. Please try again.',
      })
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>
      {/* Hidden Native Date Input for Calendar Picker */}
      <input
        ref={dateInputRef}
        type="date"
        className="profile-form__hidden-date-picker"
        value={getPickerValue()}
        onChange={handleDatePickerChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Row 1: Full name * & Email * */}
      <div className="profile-form__row">
        <Input
          id="profile-fullName"
          name="fullName"
          label="Full name"
          placeholder="Anjali Deshmukh"
          value={values.fullName}
          error={errors.fullName}
          onChange={handleChange}
          required
          autoComplete="name"
        />

        <Input
          id="profile-email"
          name="email"
          type="email"
          label="Email"
          placeholder="anjali@shreedeshmukh.in"
          value={values.email}
          error={errors.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </div>

      {/* Row 2: Date of birth * & PAN * */}
      <div className="profile-form__row">
        <Input
          id="profile-dob"
          name="dob"
          label="Date of birth"
          placeholder="14-03-1988"
          maxLength={10}
          value={values.dob}
          error={errors.dob}
          onChange={handleChange}
          required
          autoComplete="bday"
          suffix={
            <button
              type="button"
              className="dob-calendar-btn"
              onClick={openCalendar}
              title="Open calendar picker"
              aria-label="Open calendar picker"
            >
              <svg className="form-field-icon dob-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          }
        />

        <Input
          id="profile-pan"
          name="pan"
          label="PAN"
          placeholder="AXTPD4419K"
          maxLength={10}
          value={values.pan}
          error={errors.pan}
          onChange={handleChange}
          required
          autoCapitalize="characters"
        />
      </div>

      {/* Row 3: Aadhaar number * & Mobile */}
      <div className="profile-form__row">
        <Input
          id="profile-aadhaar"
          name="aadhaar"
          label="Aadhaar number"
          placeholder="12-digit Aadhaar"
          inputMode="numeric"
          maxLength={12}
          value={values.aadhaar}
          error={errors.aadhaar}
          onChange={handleChange}
          required
        />

        <Input
          id="profile-mobile"
          name="mobile"
          type="tel"
          label="Mobile"
          inputMode="numeric"
          maxLength={14}
          placeholder="+91 98670 41255"
          value={values.mobile}
          error={errors.mobile}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>

      {/* Row 4: Create passcode * & Confirm passcode * */}
      <div className="profile-form__row">
        <Input
          id="profile-passcode"
          name="passcode"
          type="password"
          label="Create passcode"
          placeholder="6 digit passcode"
          inputMode="numeric"
          maxLength={6}
          value={values.passcode}
          error={errors.passcode}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <Input
          id="profile-confirmPasscode"
          name="confirmPasscode"
          type="password"
          label="Confirm passcode"
          placeholder="Confirm passcode"
          inputMode="numeric"
          maxLength={6}
          value={values.confirmPasscode}
          error={errors.confirmPasscode}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
      </div>

      {/* Row 4: Address * (Full width) */}
      <div className="profile-form__row profile-form__row--full">
        <div className={`field ${errors.address ? 'field--invalid' : ''}`}>
          <label className="field__label" htmlFor="profile-address">
            Address<span aria-hidden="true"> *</span>
          </label>
          <div className="address-control-wrapper">
            <textarea
              id="profile-address"
              name="address"
              rows={3}
              className="address-textarea"
              placeholder="Shop 14, Laxmi Complex, FC Road, Pune, Maharashtra 411004"
              value={values.address}
              onChange={handleChange}
              required
            />
          </div>
          {errors.address && (
            <p className="field__error" role="alert">
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {errors.form && (
        <div className="profile-form__alert-error" role="alert">
          <svg className="profile-form__alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errors.form}</span>
        </div>
      )}

      {/* CTA Button: Continue -> */}
      <div className="profile-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="profile-form__submit-btn"
        >
          Continue →
        </Button>
      </div>
    </form>
  )
}
