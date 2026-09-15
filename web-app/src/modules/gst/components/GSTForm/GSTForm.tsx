import { Button, Input } from '@shared/components'
import { INDIAN_STATES } from '@shared/constants'
import { useZodForm } from '@shared/hooks'
import { titleCase } from '@shared/utils'

import { GST_BUSINESS_TYPES } from '../../types/gst.types'
import { gstRegistrationSchema } from '../../validation/gstSchema'
import type { GstRegistrationInput, GstRegistrationOutput } from '../../validation/gstSchema'
import './GSTForm.css'

export interface GSTFormProps {
  onSubmit: (values: GstRegistrationOutput) => Promise<void>
}

const initialValues: GstRegistrationInput = {
  legalName: '',
  tradeName: '',
  businessType: 'proprietorship',
  pan: '',
  state: '',
  turnover: '',
  email: '',
  mobile: '',
}

export const GSTForm = ({ onSubmit }: GSTFormProps) => {
  const form = useZodForm(gstRegistrationSchema, initialValues, onSubmit)

  return (
    <form className="gst-form" onSubmit={form.handleSubmit} noValidate>
      <div className="gst-form__row">
        <Input
          name="legalName"
          label="Legal name"
          hint="Exactly as printed on the PAN card (text only)"
          value={String(form.values.legalName)}
          error={form.errors.legalName}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
            form.handleChange(e)
          }}
          required
        />
        <Input
          name="tradeName"
          label="Trade name"
          hint="Optional (text only)"
          value={String(form.values.tradeName ?? '')}
          error={form.errors.tradeName}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')
            form.handleChange(e)
          }}
        />
      </div>

      <div className="gst-form__row">
        <div className="field">
          <label className="field__label" htmlFor="businessType">
            Business type
          </label>
          <div className="field__control">
            <select
              id="businessType"
              name="businessType"
              className="field__input"
              value={String(form.values.businessType)}
              onChange={form.handleChange}
            >
              {GST_BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {titleCase(type)}
                </option>
              ))}
            </select>
          </div>
          {form.errors.businessType && <p className="field__error">{form.errors.businessType}</p>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="state">
            State of business
          </label>
          <div className="field__control">
            <select
              id="state"
              name="state"
              className="field__input"
              value={String(form.values.state)}
              onChange={form.handleChange}
              required
            >
              <option value="">Select</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          {form.errors.state && <p className="field__error">{form.errors.state}</p>}
        </div>
      </div>

      <div className="gst-form__row">
        <Input
          name="pan"
          label="PAN"
          maxLength={10}
          placeholder="AABCT1234H"
          value={String(form.values.pan)}
          error={form.errors.pan}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
            form.handleChange(e)
          }}
          required
        />
        <Input
          name="turnover"
          label="Annual turnover"
          inputMode="numeric"
          prefix="₹"
          placeholder="2500000"
          value={String(form.values.turnover)}
          error={form.errors.turnover}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '')
            form.handleChange(e)
          }}
          required
        />
      </div>

      <div className="gst-form__row">
        <Input
          name="email"
          type="email"
          label="Email"
          value={String(form.values.email)}
          error={form.errors.email}
          onChange={form.handleChange}
          required
        />
        <Input
          name="mobile"
          label="Mobile"
          inputMode="numeric"
          maxLength={10}
          prefix="+91"
          placeholder="10-digit number"
          value={String(form.values.mobile)}
          error={form.errors.mobile}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)
            form.handleChange(e)
          }}
          required
        />
      </div>

      {form.errors.form && <p className="gst-form__error">{form.errors.form}</p>}

      <div className="gst-form__actions">
        <Button type="submit" size="lg" isLoading={form.isSubmitting}>
          Submit application
        </Button>
      </div>
    </form>
  )
}
