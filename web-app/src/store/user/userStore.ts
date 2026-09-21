import { create } from 'zustand'

export interface UserPreferences {
  language: 'en' | 'hi' | 'te'
  emailAlerts: boolean
  smsAlerts: boolean
}

interface UserState {
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  emailAlerts: true,
  smsAlerts: true,
}

export const useUserStore = create<UserState>((set) => ({
  preferences: defaultPreferences,
  setPreferences: (preferences) =>
    set((state) => ({ preferences: { ...state.preferences, ...preferences } })),
}))
