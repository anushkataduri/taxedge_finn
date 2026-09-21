import { authStorage } from './authStorage'
import type { AuthSession, AuthUser, UserRole } from './authTypes'

type Listener = (session: AuthSession | null) => void

const listeners = new Set<Listener>()

/**
 * Infrastructure-level session handling: who is signed in, and their tokens.
 * Login/OTP/registration flows live in modules/authentication.
 */
export const authService = {
  getAccessToken(): string | null {
    return authStorage.getTokens()?.accessToken ?? null
  },
  getRefreshToken(): string | null {
    return authStorage.getTokens()?.refreshToken ?? null
  },
  getUser(): AuthUser | null {
    return authStorage.getUser()
  },
  isAuthenticated(): boolean {
    return Boolean(authStorage.getTokens()?.accessToken)
  },
  hasRole(...roles: UserRole[]): boolean {
    const user = authStorage.getUser()
    return user ? roles.includes(user.role) : false
  },
  startSession(session: AuthSession): void {
    authStorage.setTokens(session.tokens)
    authStorage.setUser(session.user)
    listeners.forEach((listener) => listener(session))
  },
  updateUser(user: AuthUser): void {
    authStorage.setUser(user)
    const tokens = authStorage.getTokens()
    listeners.forEach((listener) => listener(tokens ? { user, tokens } : null))
  },
  endSession(): void {
    authStorage.clear()
    listeners.forEach((listener) => listener(null))
  },
  /** Lets providers react to sign-in / sign-out triggered anywhere (e.g. a 401). */
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
