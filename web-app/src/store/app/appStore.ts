import { create } from 'zustand'

import { STORAGE_KEYS } from '@core/config'
import { localStore } from '@core/storage'

export type ThemeMode = 'light' | 'dark'

export interface Toast {
  id: string
  message: string
  tone: 'info' | 'success' | 'error'
}

interface AppState {
  theme: ThemeMode
  isSidebarOpen: boolean
  toasts: Toast[]
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  pushToast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: string) => void
  clearToasts: () => void
}

const initialTheme: ThemeMode = localStore.get<ThemeMode>(STORAGE_KEYS.theme) ?? 'light'

export const useAppStore = create<AppState>((set) => ({
  theme: initialTheme,
  isSidebarOpen: true,
  toasts: [],

  setTheme: (theme) => {
    localStore.set(STORAGE_KEYS.theme, theme)
    set({ theme })
  },

  toggleTheme: () =>
    set((state) => {
      const theme: ThemeMode = state.theme === 'light' ? 'dark' : 'light'
      localStore.set(STORAGE_KEYS.theme, theme)
      return { theme }
    }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  pushToast: (message, tone = 'info') =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, tone }],
    })),

  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}))
