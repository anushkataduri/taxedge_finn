import { apiClient, apiEndpoints } from '@core/api'
import type { AuthUser } from '@core/auth'

import type {
  CreateProfilePayload,
  LoginPayload,
  LoginResponse,
  PasscodePayload,
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  VerifyOtpPayload,
} from '../types/auth.types'

/** Thin transport layer: one function per endpoint, no business rules. */
export const authApi = {
  login: (payload: LoginPayload) => apiClient.post<LoginResponse>(apiEndpoints.auth.login, payload),
  register: (payload: RegisterPayload) => apiClient.post<RegisterResponse>(apiEndpoints.auth.register, payload),
  sendOtp: (payload: SendOtpPayload) => apiClient.post<{ sent: boolean }>(apiEndpoints.auth.sendOtp, payload),
  verifyOtp: (payload: VerifyOtpPayload) => apiClient.post<LoginResponse>(apiEndpoints.auth.verifyOtp, payload),
  setPasscode: (payload: PasscodePayload) => apiClient.post<{ ok: boolean }>(apiEndpoints.auth.setPasscode, payload),
  createProfile: (payload: CreateProfilePayload) => apiClient.put<AuthUser>(apiEndpoints.auth.profile, payload),
  logout: () => apiClient.post<void>(apiEndpoints.auth.logout),
}
