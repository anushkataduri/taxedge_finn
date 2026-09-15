import { create } from 'zustand'

import { authService } from '@core/auth'
import type { AuthSession, AuthUser } from '@core/auth'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  signIn: (session: AuthSession) => void
  signOut: () => void
  setUser: (user: AuthUser) => void
  bootstrap: () => void
}

/**
 * Reactive mirror of the session held by core/auth.
 * core/auth owns persistence; this store owns re-rendering.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getUser(),
  isAuthenticated: authService.isAuthenticated(),
  isBootstrapping: false,

  signIn: (session) => {
    authService.startSession(session)
    set({ user: session.user, isAuthenticated: true })
  },

  signOut: () => {
    authService.endSession()
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => {
    authService.updateUser(user)
    set({ user })
  },

  bootstrap: () => {
    set({
      user: authService.getUser(),
      isAuthenticated: authService.isAuthenticated(),
      isBootstrapping: false,
    })
  },
}))

/** Keeps the store in sync when a session ends outside React (e.g. a failed refresh). */
authService.subscribe((session) => {
  useAuthStore.setState({
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
  })
})
