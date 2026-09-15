import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Enter your full name'),

  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Enter a valid email address'),

  dob: z
    .string()
    .trim()
    .min(1, 'Date of birth is required'),

  pan: z
    .string()
    .trim()
    .min(1, 'PAN is required')
    .transform((val) => val.toUpperCase().slice(0, 10))
    .refine((val) => val.length === 10, 'Enter a valid 10-character PAN'),

  aadhaar: z
    .string()
    .trim()
    .min(1, 'Aadhaar number is required')
    .transform((val) => val.replace(/\D/g, '').slice(0, 12))
    .refine((val) => val.length === 12, 'Enter a valid 12-digit Aadhaar number'),

  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .transform((val) => val.replace(/\D/g, '').slice(0, 10))
    .refine((val) => val.length === 10, 'Enter any valid 10-digit mobile number'),

  passcode: z
    .string()
    .trim()
    .min(1, 'Passcode is required')
    .transform((val) => val.replace(/\D/g, '').slice(0, 6))
    .refine((val) => val.length === 6, 'Enter a 6-digit passcode'),

  confirmPasscode: z
    .string()
    .trim()
    .min(1, 'Please confirm your passcode')
    .transform((val) => val.replace(/\D/g, '').slice(0, 6))
    .refine((val) => val.length === 6, 'Enter a 6-digit passcode'),

  address: z
    .string()
    .trim()
    .min(1, 'Address is required'),
})
.refine((data) => data.passcode === data.confirmPasscode, {
  message: 'Passcodes do not match',
  path: ['confirmPasscode'],
})

export type ProfileFormValues = {
  fullName: string
  email: string
  dob: string
  pan: string
  aadhaar: string
  mobile: string
  passcode: string
  confirmPasscode: string
  address: string
}

export type ProfileInput = z.infer<typeof profileSchema>
