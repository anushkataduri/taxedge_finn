import { z } from 'zod'

import { REGEX } from '@shared/constants'

import { GST_BUSINESS_TYPES, GST_RETURN_TYPES } from '../types/gst.types'

export const gstRegistrationSchema = z.object({
  legalName: z.string().trim().min(3, 'Enter the legal name as per PAN'),
  tradeName: z.string().trim().optional(),
  businessType: z.enum(GST_BUSINESS_TYPES, { message: 'Select a business type' }),
  pan: z.string().trim().toUpperCase().regex(REGEX.pan, 'Enter a valid PAN'),
  state: z.string().trim().min(2, 'Select the state of business'),
  turnover: z.coerce.number().min(0, 'Turnover cannot be negative'),
  email: z.string().trim().email('Enter a valid email address'),
  mobile: z.string().trim().regex(REGEX.mobile, 'Enter a valid 10-digit mobile number'),
})

export const gstReturnSchema = z.object({
  gstin: z.string().trim().toUpperCase().regex(REGEX.gstin, 'Enter a valid 15-character GSTIN'),
  returnType: z.enum(GST_RETURN_TYPES, { message: 'Select a return type' }),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Use the YYYY-MM format'),
  taxableValue: z.coerce.number().min(0, 'Taxable value cannot be negative'),
  taxPayable: z.coerce.number().min(0, 'Tax payable cannot be negative'),
})

export type GstRegistrationInput = z.input<typeof gstRegistrationSchema>
export type GstRegistrationOutput = z.output<typeof gstRegistrationSchema>
export type GstReturnInput = z.input<typeof gstReturnSchema>
export type GstReturnOutput = z.output<typeof gstReturnSchema>
