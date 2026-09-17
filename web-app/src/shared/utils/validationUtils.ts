import { REGEX } from '../constants/common.constants'

export const isValidPan = (value: string): boolean => REGEX.pan.test(value.toUpperCase())
export const isValidGstin = (value: string): boolean => REGEX.gstin.test(value.toUpperCase())
export const isValidMobile = (value: string): boolean => REGEX.mobile.test(value)
export const isValidPincode = (value: string): boolean => REGEX.pincode.test(value)

/** PAN embedded in a GSTIN, characters 3-12. */
export const panFromGstin = (gstin: string): string | null =>
  isValidGstin(gstin) ? gstin.slice(2, 12) : null

export const isNonEmpty = (value: string | null | undefined): boolean => Boolean(value && value.trim().length > 0)
