import type { AuthSession, AuthUser } from '@core/auth'

export interface LoginPayload {
  mobile: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  mobile: string
  password: string
}

export interface SendOtpPayload {
  mobile: string
}

export interface VerifyOtpPayload {
  mobile: string
  otp: string
}

export interface PasscodePayload {
  passcode: string
}

export interface VerifyPasscodePayload {
  mobile: string
  passcode: string
}

export interface SaveRegistrationStep1Payload {
  mobile: string
  passcode: string
  user: AuthUser
}

export interface CreateProfilePayload {
  pan: string
  addressLine: string
  city: string
  state: string
  pincode: string
}

export type LoginResponse = AuthSession
export type RegisterResponse = { user: AuthUser; otpSent: boolean }
