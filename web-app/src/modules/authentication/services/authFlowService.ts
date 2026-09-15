import { env } from '@core/config'
import { authStorage, permissionsFor } from '@core/auth'
import type { AuthSession, AuthUser, UserRole } from '@core/auth'

import { authApi } from '../api/authApi'
import type {
  CreateProfilePayload,
  LoginPayload,
  RegisterPayload,
  SaveRegistrationStep1Payload,
  VerifyOtpPayload,
  VerifyPasscodePayload,
} from '../types/auth.types'

/* ------------------------------------------------------------------ *
 * Development mocks - delete this block once the API is live.
 * ------------------------------------------------------------------ */
/**
 * Demo sign-ins while mocks are on:
 *   9000000001  Super admin      9000000004  GST agent
 *   9000000002  Admin            9000000005  ITR agent
 *   9000000003  Manager          anything else  Customer
 */
const DEMO_ROLES: Record<string, { role: UserRole; fullName: string; id: string; department?: string }> = {
  '9000000001': { role: 'SUPER_ADMIN', fullName: 'Vasavi Reddy', id: 'stf_001', department: 'Operations' },
  '9000000002': { role: 'ADMIN', fullName: 'Rahul Menon', id: 'stf_002', department: 'Operations' },
  '9000000003': { role: 'MANAGER', fullName: 'Priya Nair', id: 'stf_003', department: 'Compliance' },
  '9000000004': { role: 'GST_AGENT', fullName: 'Imran Shaikh', id: 'stf_004', department: 'Compliance' },
  '9000000005': { role: 'ITR_AGENT', fullName: 'Sneha Kulkarni', id: 'stf_005', department: 'Compliance' },
}

const mockUser = (mobile: string): AuthUser => {
  const clean = mobile.replace(/\D/g, '')
  const demo = DEMO_ROLES[clean]
  if (demo) {
    return {
      id: demo.id,
      fullName: demo.fullName,
      email: `${demo.fullName.split(' ')[0].toLowerCase()}@taxedge.in`,
      mobile: clean,
      role: demo.role,
      department: demo.department,
      permissions: permissionsFor(demo.role),
      isProfileComplete: true,
    }
  }

  const registeredRecord = authStorage.getRegisteredUser(clean)
  if (registeredRecord?.user) {
    return {
      ...registeredRecord.user,
      isProfileComplete: Boolean(registeredRecord.isRegistered),
    }
  }

  const stored = authStorage.getUser()
  if (stored && stored.fullName && stored.isProfileComplete && stored.fullName !== 'Customer') {
    return stored
  }

  return {
    id: `usr_${Date.now().toString(36)}`,
    fullName: stored?.fullName || '',
    email: stored?.email || '',
    mobile: clean || stored?.mobile || '',
    role: 'CUSTOMER',
    permissions: [],
    isProfileComplete: false,
  }
}

const mockSession = (mobile: string): AuthSession => ({
  user: mockUser(mobile),
  tokens: { accessToken: 'mock.access.token', refreshToken: 'mock.refresh.token' },
})

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))
/* ------------------------------------------------------------------ */

/**
 * Business rules for signing in and registration. Pages call this, never authApi directly,
 * so the mock switch and multi-step logic lives in one place.
 */
export const authFlowService = {
  /** Check if a mobile number is already registered (has completed Step 2) */
  isRegistered(mobile: string): boolean {
    const clean = mobile.replace(/\D/g, '')
    if (DEMO_ROLES[clean]) return true
    return authStorage.isMobileRegistered(clean)
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    if (env.enableMocks) {
      await delay()
      return mockSession(payload.mobile)
    }
    return authApi.login(payload)
  },

  async verifyPasscode(payload: VerifyPasscodePayload): Promise<AuthSession> {
    const clean = payload.mobile.replace(/\D/g, '')
    if (env.enableMocks) {
      await delay(300)
      if (DEMO_ROLES[clean]) {
        if (payload.passcode !== '123456') {
          throw new Error('Incorrect passcode. Try 123456 in demo mode.')
        }
        const session = mockSession(clean)
        authStorage.setTokens(session.tokens)
        authStorage.setUser(session.user)
        return session
      }

      const record = authStorage.getRegisteredUser(clean)
      if (!record || !record.isRegistered) {
        throw new Error('No registered account found for this mobile number.')
      }

      if (record.passcode !== payload.passcode) {
        throw new Error('Incorrect passcode. Please try again.')
      }

      const session: AuthSession = {
        user: record.user,
        tokens: { accessToken: 'mock.access.token', refreshToken: 'mock.refresh.token' },
      }
      authStorage.setTokens(session.tokens)
      authStorage.setUser(record.user)
      return session
    }

    return authApi.login({ mobile: payload.mobile, password: payload.passcode })
  },

  async saveRegistrationStep1(payload: SaveRegistrationStep1Payload): Promise<void> {
    const clean = payload.mobile.replace(/\D/g, '')
    authStorage.saveRegisteredUser({
      mobile: clean,
      passcode: payload.passcode,
      isRegistered: false,
      user: payload.user,
    })
  },

  async completeRegistration(mobile: string): Promise<void> {
    const clean = mobile.replace(/\D/g, '')
    const record = authStorage.getRegisteredUser(clean)
    if (record) {
      const updatedUser: AuthUser = {
        ...record.user,
        isProfileComplete: true,
      }
      authStorage.saveRegisteredUser({
        ...record,
        isRegistered: true,
        user: updatedUser,
      })
      authStorage.setUser(updatedUser)
    } else {
      const currentUser = authStorage.getUser()
      if (currentUser) {
        const completedUser = { ...currentUser, isProfileComplete: true }
        authStorage.saveRegisteredUser({
          mobile: clean,
          passcode: '123456',
          isRegistered: true,
          user: completedUser,
        })
        authStorage.setUser(completedUser)
      }
    }
  },

  async register(payload: RegisterPayload): Promise<{ mobile: string }> {
    if (env.enableMocks) {
      await delay()
      const user: AuthUser = {
        id: `usr_${Date.now().toString(36)}`,
        fullName: payload.fullName,
        email: payload.email,
        mobile: payload.mobile,
        role: 'CUSTOMER',
        permissions: [],
        isProfileComplete: false,
      }
      authStorage.saveRegisteredUser({
        mobile: payload.mobile,
        passcode: payload.password,
        isRegistered: false,
        user,
      })
      authStorage.setUser(user)
      return { mobile: payload.mobile }
    }
    await authApi.register(payload)
    return { mobile: payload.mobile }
  },

  async sendOtp(mobile: string): Promise<void> {
    if (env.enableMocks) {
      await delay(300)
      return
    }
    await authApi.sendOtp({ mobile })
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthSession> {
    if (env.enableMocks) {
      await delay()
      if (payload.otp !== '123456') throw new Error('That code is incorrect. Try 123456 in demo mode.')
      const session = mockSession(payload.mobile)
      authStorage.setTokens(session.tokens)
      authStorage.setUser(session.user)
      return session
    }
    return authApi.verifyOtp(payload)
  },

  async setPasscode(passcode: string): Promise<void> {
    if (env.enableMocks) {
      await delay(300)
      return
    }
    await authApi.setPasscode({ passcode })
  },

  async createProfile(payload: CreateProfilePayload): Promise<AuthUser> {
    if (env.enableMocks) {
      await delay()
      return { ...mockUser('9999999999'), isProfileComplete: true }
    }
    return authApi.createProfile(payload)
  },

  async logout(): Promise<void> {
    if (env.enableMocks) return
    try {
      await authApi.logout()
    } catch {
      /* signing out locally must succeed even if the server call fails */
    }
  },
}
