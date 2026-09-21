import { z } from 'zod'

import { REGEX } from '@shared/constants'

export const mobileField = z
  .string()
  .trim()
  .regex(REGEX.mobile, 'Enter a valid 10-digit Indian mobile number')

export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number')

export const loginSchema = z.object({
  mobile: mobileField,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  fullName: z.string().trim().min(3, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  mobile: mobileField,
  password: passwordField,
})

export const otpSchema = z.object({
  mobile: mobileField,
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

export const passcodeSchema = z.object({
  passcode: z.string().regex(/^\d{4}$/, 'Passcode must be 4 digits'),
})

export const createProfileSchema = z.object({
  pan: z.string().trim().toUpperCase().regex(REGEX.pan, 'Enter a valid PAN'),
  addressLine: z.string().trim().min(5, 'Enter your address'),
  city: z.string().trim().min(2, 'Enter your city'),
  state: z.string().trim().min(2, 'Select your state'),
  pincode: z.string().trim().regex(REGEX.pincode, 'Enter a valid 6-digit PIN code'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type OtpInput = z.infer<typeof otpSchema>
export type PasscodeInput = z.infer<typeof passcodeSchema>
export type CreateProfileInput = z.infer<typeof createProfileSchema>
